import { PrismaClient, Role } from '@prisma/client';
import xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clean sweep to avoid orphans during repeated seeds
  console.log('Cleaning up old data...');
  await prisma.enrollment.deleteMany({});
  await prisma.kelas.deleteMany({});
  await prisma.cpmkCplMapping.deleteMany({});
  await prisma.cPMK.deleteMany({});
  await prisma.courseCPLMapping.deleteMany({});
  await prisma.cPL.deleteMany({});
  await prisma.mataKuliah.deleteMany({});
  await prisma.dosen.deleteMany({});
  await prisma.mahasiswa.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed default CPLs
  console.log('Seeding CPLs...');
  const cpl1 = await prisma.cPL.create({ data: { kode: 'CPL-1', deskripsi: 'Sikap dan Tata Nilai' }});
  const cpl2 = await prisma.cPL.create({ data: { kode: 'CPL-2', deskripsi: 'Penguasaan Pengetahuan' }});
  const cpl3 = await prisma.cPL.create({ data: { kode: 'CPL-3', deskripsi: 'Keterampilan Umum' }});
  const cpl4 = await prisma.cPL.create({ data: { kode: 'CPL-4', deskripsi: 'Keterampilan Khusus' }});

  // Create Admin
  const userAdmin = await prisma.user.upsert({
    where: { username: 'admin@staff.uns.ac.id' },
    update: {},
    create: {
      username: 'admin@staff.uns.ac.id',
      password: 'password',
      name: 'Administrator',
      role: Role.ADMIN,
    },
  });

  // Create Mutu
  const userMutu = await prisma.user.upsert({
    where: { username: 'mutu@staff.uns.ac.id' },
    update: {},
    create: {
      username: 'mutu@staff.uns.ac.id',
      password: 'password123',
      name: 'Gugus Mutu',
      role: Role.MUTU,
    },
  });

  // Kaprodi akan di-seed setelah Dosen di-seed untuk mengkoneksikannya dengan Prof Wakhid
  await prisma.mutu.upsert({
    where: { userId: userMutu.id },
    update: {},
    create: {
      userId: userMutu.id,
      name: 'Gugus Mutu'
    }
  });

  const datasetDir = path.join(process.cwd(), 'dataset/APSI 25_5_26');
  
  // 1. Parse Data Pengampu.xlsx
  const pengampuFile = path.join(datasetDir, 'Data Pengampu.xlsx');
  if (fs.existsSync(pengampuFile)) {
    console.log('Parsing Data Pengampu.xlsx...');
    const wb = xlsx.readFile(pengampuFile);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    // row 0 is header
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 5) continue;
      
      const kodeMkRaw = row[1];
      if (!kodeMkRaw) continue;
      const kodeMk = String(kodeMkRaw).trim();
      
      let namaMk = String(row[2] || '').trim();
      // remove " (2 SKS)" from namaMk if present
      namaMk = namaMk.replace(/\s\(\d+\sSKS\)$/i, '').trim();
      
      const namaDosenRaw = String(row[3] || '').trim();
      const dosenParts = namaDosenRaw.split('-');
      const nidn = dosenParts[0].trim();
      const namaDosen = (dosenParts[1] || namaDosenRaw).trim();
      
      const kelasName = String(row[4] || '').trim();
      const kuota = parseInt(row[5]) || 0;
      const sks = parseInt(row[11]) || 2;
      
      // Upsert MataKuliah
      const mk = await prisma.mataKuliah.upsert({
        where: { kodeMk },
        update: {},
        create: {
          kodeMk,
          namaMk,
          sks,
        }
      });
      
      // Upsert Dosen & User
      const userDosen = await prisma.user.upsert({
        where: { username: nidn },
        update: {},
        create: {
          username: nidn,
          password: 'password',
          name: namaDosen,
          role: Role.DOSEN,
        }
      });
      
      const dosen = await prisma.dosen.upsert({
        where: { nidn },
        update: {},
        create: {
          nidn,
          userId: userDosen.id,
          name: namaDosen,
        }
      });
      
      // Upsert Kelas
      await prisma.kelas.upsert({
        where: {
          mataKuliahId_namaKelas: {
            mataKuliahId: mk.id,
            namaKelas: kelasName,
          }
        },
        update: {
          kuotaReguler: kuota,
        },
        create: {
          mataKuliahId: mk.id,
          dosenId: dosen.id,
          namaKelas: kelasName,
          kuotaReguler: kuota,
        }
      });
    }
  }

  // 2. Parse UK grading files
  const files = fs.readdirSync(datasetDir);
  const ukFiles = files.filter(f => f.match(/^\d+_.*\.xlsx$/));
  
  for (const file of ukFiles) {
    console.log(`Parsing UK file: ${file}`);
    const filePath = path.join(datasetDir, file);
    
    // Extract info from filename: 08033142038_2024_Ganjil_A.xlsx
    const parts = file.replace('.xlsx', '').split('_');
    const kodeMk = parts[0];
    const kelasName = parts[parts.length - 1]; // usually A, B, C...
    
    // find or create MK & Kelas
    let mk = await prisma.mataKuliah.findUnique({ where: { kodeMk } });
    if (!mk) {
      mk = await prisma.mataKuliah.create({
        data: { kodeMk, namaMk: 'Mata Kuliah ' + kodeMk, sks: 2 }
      });
    }
    
    // find Kelas. If not found, create a dummy dosen first
    let kelas = await prisma.kelas.findUnique({
      where: {
        mataKuliahId_namaKelas: { mataKuliahId: mk.id, namaKelas: kelasName }
      }
    });
    
    if (!kelas) {
      let dummyDosen = await prisma.dosen.findFirst();
      if (!dummyDosen) {
        const dUser = await prisma.user.create({ data: { username: 'dummydosen', password: 'password', name: 'Dummy Dosen', role: Role.DOSEN }});
        dummyDosen = await prisma.dosen.create({ data: { nidn: 'dummydosen', name: 'Dummy Dosen', userId: dUser.id } });
      }
      kelas = await prisma.kelas.create({
        data: {
          mataKuliahId: mk.id,
          dosenId: dummyDosen.id,
          namaKelas: kelasName,
        }
      });
    }

    const wb = xlsx.readFile(filePath);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    // rows 14 onwards contain students
    for (let i = 14; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[1] || typeof row[1] !== 'string') continue;
      
      const nim = row[1].trim();
      const nama = String(row[2] || '').trim();
      
      const vUK1 = parseFloat(row[3]) || null;
      const vUK2 = parseFloat(row[4]) || null;
      const vUK3 = parseFloat(row[5]) || null;
      const vUK4 = parseFloat(row[6]) || null;
      const vUK5 = parseFloat(row[7]) || null;
      const vAkhir = parseFloat(row[9]) || null;
      const vHuruf = typeof row[11] === 'string' ? row[11].trim() : null;
      
      // Upsert Mahasiswa
      const userMhs = await prisma.user.upsert({
        where: { username: nim },
        update: {},
        create: {
          username: nim,
          password: 'password',
          name: nama,
          role: Role.MAHASISWA,
        }
      });
      
      const mhs = await prisma.mahasiswa.upsert({
        where: { nim },
        update: {},
        create: {
          nim,
          userId: userMhs.id,
          name: nama,
        }
      });
      
      // Upsert Enrollment
      await prisma.enrollment.upsert({
        where: {
          mahasiswaId_kelasId: {
            mahasiswaId: mhs.id,
            kelasId: kelas.id,
          }
        },
        update: {
          nilaiTugas: vUK1,
          nilaiUts: vUK2,
          nilaiUas: vUK3,
          nilaiPartisipasi: vUK4,
          nilaiProyek: vUK5,
          nilaiAkhir: vAkhir,
          huruf: vHuruf,
        },
        create: {
          mahasiswaId: mhs.id,
          kelasId: kelas.id,
          nilaiTugas: vUK1,
          nilaiUts: vUK2,
          nilaiUas: vUK3,
          nilaiPartisipasi: vUK4,
          nilaiProyek: vUK5,
          nilaiAkhir: vAkhir,
          huruf: vHuruf,
        }
      });
    }
  }

  // Assign Kaprodi ke Prof Wakhid
  const profWakhid = await prisma.dosen.findFirst({
    where: { name: { contains: 'Wakhid Ahmad Jauhari', mode: 'insensitive' } },
    include: { user: true }
  });

  if (profWakhid) {
    // Update user record-nya
    await prisma.user.update({
      where: { id: profWakhid.userId },
      data: {
        username: 'wakhidjauhari@staff.uns.ac.id',
        role: Role.KAPRODI
      }
    });

    // Buat record Kaprodi
    await prisma.kaprodi.upsert({
      where: { userId: profWakhid.userId },
      update: { name: profWakhid.name },
      create: {
        userId: profWakhid.userId,
        name: profWakhid.name
      }
    });
    console.log("Kaprodi assigned to Prof. Wakhid");
  }
  
  console.log('Seeding finished!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

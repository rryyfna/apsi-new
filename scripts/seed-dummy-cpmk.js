const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy CPMK & mappings...');
  
  const allMks = await prisma.mataKuliah.findMany();
  const allCpls = await prisma.cPL.findMany({ orderBy: { kode: 'asc' } });
  
  if (allCpls.length === 0) {
    console.log('No CPLs found! Creating default CPLs...');
    for (let i = 1; i <= 6; i++) {
      await prisma.cPL.upsert({
        where: { kode: `CPL-${i}` },
        update: {},
        create: {
          kode: `CPL-${i}`,
          deskripsi: `Deskripsi CPL-${i}`
        }
      });
    }
  }

  const cpls = await prisma.cPL.findMany({ orderBy: { kode: 'asc' } });
  
  let cpmkCount = 0;
  let kolomCount = 0;

  for (const mk of allMks) {
    // Create 2 CPMKs per MK
    const cpmk1 = await prisma.cPMK.upsert({
      where: { mataKuliahId_kode: { mataKuliahId: mk.id, kode: 'CPMK-1' } },
      update: {},
      create: { mataKuliahId: mk.id, kode: 'CPMK-1', deskripsi: 'Mampu menjelaskan konsep dasar' }
    });
    
    const cpmk2 = await prisma.cPMK.upsert({
      where: { mataKuliahId_kode: { mataKuliahId: mk.id, kode: 'CPMK-2' } },
      update: {},
      create: { mataKuliahId: mk.id, kode: 'CPMK-2', deskripsi: 'Mampu mengaplikasikan teori' }
    });
    cpmkCount += 2;

    // Map CPMK-1 to first half of CPLs
    for (let i = 0; i < cpls.length / 2; i++) {
      await prisma.cpmkCplMapping.upsert({
        where: { cpmkId_cplId: { cpmkId: cpmk1.id, cplId: cpls[i].id } },
        update: {},
        create: { cpmkId: cpmk1.id, cplId: cpls[i].id, bobot: 50 }
      });
    }
    
    // Map CPMK-2 to second half of CPLs
    for (let i = Math.floor(cpls.length / 2); i < cpls.length; i++) {
      await prisma.cpmkCplMapping.upsert({
        where: { cpmkId_cplId: { cpmkId: cpmk2.id, cplId: cpls[i].id } },
        update: {},
        create: { cpmkId: cpmk2.id, cplId: cpls[i].id, bobot: 50 }
      });
    }

    // Now bind columns for each Kelas of this MK
    const kelasList = await prisma.kelas.findMany({ where: { mataKuliahId: mk.id } });
    
    for (const kelas of kelasList) {
      // CPMK-1 evaluated by Tugas (20%) and UTS (30%)
      await prisma.kelasCpmkKolomNilai.upsert({
        where: { kelasId_namaKolom: { kelasId: kelas.id, namaKolom: 'Tugas' } },
        update: { cpmkId: cpmk1.id, bobot: kelas.bobotTugas || 20 },
        create: { kelasId: kelas.id, cpmkId: cpmk1.id, namaKolom: 'Tugas', bobot: kelas.bobotTugas || 20 }
      });
      await prisma.kelasCpmkKolomNilai.upsert({
        where: { kelasId_namaKolom: { kelasId: kelas.id, namaKolom: 'UTS' } },
        update: { cpmkId: cpmk1.id, bobot: kelas.bobotUts || 30 },
        create: { kelasId: kelas.id, cpmkId: cpmk1.id, namaKolom: 'UTS', bobot: kelas.bobotUts || 30 }
      });
      
      // CPMK-2 evaluated by UAS (30%), Partisipasi (10%), Proyek (10%)
      await prisma.kelasCpmkKolomNilai.upsert({
        where: { kelasId_namaKolom: { kelasId: kelas.id, namaKolom: 'UAS' } },
        update: { cpmkId: cpmk2.id, bobot: kelas.bobotUas || 30 },
        create: { kelasId: kelas.id, cpmkId: cpmk2.id, namaKolom: 'UAS', bobot: kelas.bobotUas || 30 }
      });
      await prisma.kelasCpmkKolomNilai.upsert({
        where: { kelasId_namaKolom: { kelasId: kelas.id, namaKolom: 'Partisipasi' } },
        update: { cpmkId: cpmk2.id, bobot: kelas.bobotPartisipasi || 10 },
        create: { kelasId: kelas.id, cpmkId: cpmk2.id, namaKolom: 'Partisipasi', bobot: kelas.bobotPartisipasi || 10 }
      });
      await prisma.kelasCpmkKolomNilai.upsert({
        where: { kelasId_namaKolom: { kelasId: kelas.id, namaKolom: 'Proyek' } },
        update: { cpmkId: cpmk2.id, bobot: kelas.bobotProyek || 10 },
        create: { kelasId: kelas.id, cpmkId: cpmk2.id, namaKolom: 'Proyek', bobot: kelas.bobotProyek || 10 }
      });
      kolomCount += 5;
    }
  }
  
  console.log(`Created ${cpmkCount} CPMKs and mapped ${kolomCount} Kolom Nilai.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

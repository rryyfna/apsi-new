'use server';

import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function getUserId() {
  const headersList = await headers();
  return headersList.get('x-user-id');
}

export async function getDosenDashboardData() {
  const userId = await getUserId();
  if (!userId) redirect('/');

  const dosen = await db.dosen.findUnique({
    where: { userId },
    include: {
      kelas: {
        include: {
          mataKuliah: true,
          _count: {
            select: { enrollments: true }
          },
          enrollments: {
            select: { huruf: true }
          }
        }
      }
    }
  });
  if (!dosen) redirect('/');

  const totalKelas = dosen.kelas.length;
  const totalMahasiswaDiajar = dosen.kelas.reduce((acc: number, curr: any) => acc + curr._count.enrollments, 0);

  const gradeCount: Record<string, number> = {};
  
  dosen.kelas.forEach((k: any) => {
    k.enrollments.forEach((en: any) => {
      if (en.huruf) {
        gradeCount[en.huruf] = (gradeCount[en.huruf] || 0) + 1;
      }
    });
  });

  const gradeDistribution = Object.keys(gradeCount).map(grade => ({
    grade,
    count: gradeCount[grade]
  })).sort((a, b) => a.grade.localeCompare(b.grade));

  return {
    profile: {
      nidn: dosen.nidn,
      name: dosen.name,
    },
    stats: {
      totalKelas,
      totalMahasiswaDiajar
    },
    gradeDistribution,
    kelas: dosen.kelas.map((k: any) => ({
      id: k.id,
      mataKuliah: k.mataKuliah.namaMk,
      kodeMk: k.mataKuliah.kodeMk,
      namaKelas: k.namaKelas,
      jumlahMahasiswa: k._count.enrollments
    }))
  };
}

export async function getKelasWithEnrollments(kelasId: string) {
  const userId = await getUserId();
  if (!userId) redirect('/');

  const dosen = await db.dosen.findUnique({ where: { userId } });
  if (!dosen) redirect('/');

  const kelas = await db.kelas.findUnique({
    where: { id: kelasId },
    include: {
      mataKuliah: true,
      enrollments: {
        include: {
          mahasiswa: true
        }
      }
    }
  });

  // Pastikan dosen ini yang mengajar
  if (kelas?.dosenId !== dosen.id) redirect('/');

  return kelas;
}

export async function updateNilai(enrollmentId: string, data: any) {
  const userId = await getUserId();
  if (!userId) return { error: 'Unauthorized' };

  // Hitung nilai akhir & huruf
  const { nilaiTugas, nilaiUts, nilaiUas, nilaiPartisipasi, nilaiProyek } = data;
  
  // Dapatkan bobot dari Kelas
  const enrollment = await db.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { kelas: true }
  });

  if (!enrollment) return { error: 'Data tidak ditemukan' };

  const wTugas = (enrollment.kelas.bobotTugas ?? 20) / 100;
  const wUts = (enrollment.kelas.bobotUts ?? 30) / 100;
  const wUas = (enrollment.kelas.bobotUas ?? 30) / 100;
  const wPartisipasi = (enrollment.kelas.bobotPartisipasi ?? 10) / 100;
  const wProyek = (enrollment.kelas.bobotProyek ?? 10) / 100;

  let total = 0;
  const t = parseFloat(nilaiTugas); if (!isNaN(t)) total += (t * wTugas);
  const uts = parseFloat(nilaiUts); if (!isNaN(uts)) total += (uts * wUts);
  const uas = parseFloat(nilaiUas); if (!isNaN(uas)) total += (uas * wUas);
  const p = parseFloat(nilaiPartisipasi); if (!isNaN(p)) total += (p * wPartisipasi);
  const pr = parseFloat(nilaiProyek); if (!isNaN(pr)) total += (pr * wProyek);

  let huruf = 'E';
  let skala4 = 0.0;
  if (total >= 85) { huruf = 'A'; skala4 = 4.0; }
  else if (total >= 80) { huruf = 'A-'; skala4 = 3.7; }
  else if (total >= 75) { huruf = 'B+'; skala4 = 3.3; }
  else if (total >= 70) { huruf = 'B'; skala4 = 3.0; }
  else if (total >= 65) { huruf = 'C+'; skala4 = 2.7; }
  else if (total >= 60) { huruf = 'C'; skala4 = 2.0; }
  else if (total >= 50) { huruf = 'D'; skala4 = 1.0; }

  await db.enrollment.update({
    where: { id: enrollmentId },
    data: {
      nilaiTugas: !isNaN(parseFloat(nilaiTugas)) ? parseFloat(nilaiTugas) : null,
      nilaiUts: !isNaN(parseFloat(nilaiUts)) ? parseFloat(nilaiUts) : null,
      nilaiUas: !isNaN(parseFloat(nilaiUas)) ? parseFloat(nilaiUas) : null,
      nilaiPartisipasi: !isNaN(parseFloat(nilaiPartisipasi)) ? parseFloat(nilaiPartisipasi) : null,
      nilaiProyek: !isNaN(parseFloat(nilaiProyek)) ? parseFloat(nilaiProyek) : null,
      nilaiAkhir: skala4,
      huruf: huruf
    }
  });

  return { success: true };
}

export async function getPlottingCpmk(kelasId: string) {
  const userId = await getUserId();
  if (!userId) redirect('/');

  const kelas = await db.kelas.findUnique({
    where: { id: kelasId },
    include: {
      mataKuliah: {
        include: {
          cpmk: {
            include: {
              kolomNilai: true
            }
          }
        }
      }
    }
  });

  if (!kelas) return null;
  return kelas.mataKuliah;
}

export async function savePlottingCpmk(mataKuliahId: string, mapping: Record<string, Record<string, number>>) {
  const userId = await getUserId();
  if (!userId) return { error: 'Unauthorized' };

  try {
    const cpmks = await db.cPMK.findMany({ where: { mataKuliahId } });
    
    // Hapus kolomNilai lama untuk mata kuliah ini
    await db.kolomNilaiCPMK.deleteMany({
      where: { cpmk: { mataKuliahId } }
    });

    const newData: { cpmkId: string, namaKolom: string, bobot: number }[] = [];
    
    // Mapping format: mapping[colName][cpmkKode] = number
    for (const colName of Object.keys(mapping)) {
      for (const cpmkKode of Object.keys(mapping[colName])) {
        const bobot = mapping[colName][cpmkKode];
        if (bobot > 0) {
          const cpmk = cpmks.find(c => c.kode === cpmkKode);
          if (cpmk) {
            newData.push({
              cpmkId: cpmk.id,
              namaKolom: colName,
              bobot: bobot
            });
          }
        }
      }
    }

    if (newData.length > 0) {
      await db.kolomNilaiCPMK.createMany({ data: newData });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Gagal menyimpan plotting CPMK' };
  }
}

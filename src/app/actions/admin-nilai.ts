'use server';

import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function isAdmin() {
  const headersList = await headers();
  const role = headersList.get('x-user-role');
  return role === 'ADMIN';
}

export async function getAllKelas() {
  if (!(await isAdmin())) redirect('/');
  const kelas = await db.kelas.findMany({
    include: {
      mataKuliah: true,
      dosen: true,
      _count: { select: { enrollments: true } }
    }
  });
  return kelas;
}

export async function getKelasWithEnrollmentsAdmin(kelasId: string) {
  if (!(await isAdmin())) redirect('/');

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
  return kelas;
}

export async function updateNilaiAdmin(enrollmentId: string, data: any) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };

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
  if (nilaiTugas) total += (parseFloat(nilaiTugas) * wTugas);
  if (nilaiUts) total += (parseFloat(nilaiUts) * wUts);
  if (nilaiUas) total += (parseFloat(nilaiUas) * wUas);
  if (nilaiPartisipasi) total += (parseFloat(nilaiPartisipasi) * wPartisipasi);
  if (nilaiProyek) total += (parseFloat(nilaiProyek) * wProyek);

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
      nilaiTugas: parseFloat(nilaiTugas) || null,
      nilaiUts: parseFloat(nilaiUts) || null,
      nilaiUas: parseFloat(nilaiUas) || null,
      nilaiPartisipasi: parseFloat(nilaiPartisipasi) || null,
      nilaiProyek: parseFloat(nilaiProyek) || null,
      nilaiAkhir: total > 0 ? skala4 : null,
      huruf: total > 0 ? huruf : null
    }
  });

  return { success: true };
}

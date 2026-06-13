'use server';

import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getMataKuliahWithCpmk() {
  const mk = await db.mataKuliah.findMany({
    include: {
      cpmk: {
        include: {
          kolomNilai: true
        }
      }
    },
    orderBy: { kodeMk: 'asc' }
  });
  return mk;
}

export async function saveCpmkSetting(mataKuliahId: string, cpmks: { id?: string, kode: string, deskripsi: string }[]) {
  try {
    // We overwrite CPMKs for this mataKuliah by recreating them. 
    // In a production app, we would selectively delete/update/create to preserve relations.
    // For now, to fulfill the requirement, we will delete existing and insert new ones.
    
    // Delete existing CPMK
    await db.cPMK.deleteMany({
      where: { mataKuliahId }
    });

    // Create new CPMK
    for (const item of cpmks) {
      await db.cPMK.create({
        data: {
          kode: item.kode,
          deskripsi: item.deskripsi,
          mataKuliahId: mataKuliahId
        }
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error saving CPMK:', error);
    return { success: false, error: 'Gagal menyimpan pengaturan CPMK' };
  }
}

export async function getMonitoringCpl() {
  // Aggregate CPL data from students' enrollments
  const enrollments = await db.enrollment.findMany({
    include: {
      mahasiswa: true,
      kelas: {
        include: {
          mataKuliah: {
            include: {
              cpmk: {
                include: {
                  kolomNilai: true,
                  cplMappings: {
                    include: {
                      cpl: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  const studentMap = new Map<string, any>();

  for (const en of enrollments) {
    const nim = en.mahasiswa.nim;
    if (!studentMap.has(nim)) {
      studentMap.set(nim, {
        id: en.mahasiswa.id,
        nim: nim,
        name: en.mahasiswa.name,
        // Ini adalah nilai agregat per CPL
        cplScores: {}
      });
    }

    const mhs = studentMap.get(nim);
    
    // Asumsi perhitungan CPL: 
    // Nilai akhir (0-100) dari mata kuliah ini menyumbang ke CPL.
    // Jika sebuah mata kuliah terpetakan ke CPL-1, CPL-2, maka nilai akhir kelas tersebut dirata-rata ke CPL.
    const nilaiTotal = (en.nilaiTugas || 0) + (en.nilaiUts || 0) + (en.nilaiUas || 0) + (en.nilaiPartisipasi || 0) + (en.nilaiProyek || 0);

    // Dapatkan daftar unik CPL untuk kelas ini
    const cplsForClass = new Set<string>();
    en.kelas.mataKuliah.cpmk.forEach(cpmk => {
      cpmk.cplMappings.forEach(m => cplsForClass.add(m.cpl.kode));
    });

    cplsForClass.forEach(cplKode => {
      if (!mhs.cplScores[cplKode]) {
        mhs.cplScores[cplKode] = { total: 0, count: 0 };
      }
      mhs.cplScores[cplKode].total += nilaiTotal;
      mhs.cplScores[cplKode].count += 1;
    });
  }

  // Format the output
  const result = Array.from(studentMap.values()).map(mhs => {
    const finalScores: Record<string, number> = {};
    for (const [cplKode, data] of Object.entries(mhs.cplScores) as any) {
      finalScores[cplKode] = Math.round(data.total / data.count);
    }
    return {
      id: mhs.id,
      nim: mhs.nim,
      name: mhs.name,
      cplScores: finalScores
    };
  });

  return result.sort((a, b) => a.nim.localeCompare(b.nim));
}

'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

async function isAdmin() {
  const headersList = await headers();
  const role = headersList.get('x-user-role');
  return role === 'ADMIN';
}

export async function savePresetBobot(kategori: string, criteria: { name: string; weight: number }[]) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };

  try {
    let template = await db.nonTeachingGradeTemplate.findFirst({
      where: { nama: kategori }
    });

    if (!template) {
      template = await db.nonTeachingGradeTemplate.create({
        data: { nama: kategori }
      });
    }

    // Delete existing components
    await db.nonTeachingGradeComponent.deleteMany({
      where: { templateId: template.id }
    });

    // Create new components
    for (const c of criteria) {
      await db.nonTeachingGradeComponent.create({
        data: {
          templateId: template.id,
          namaKriteria: c.name,
          bobot: c.weight
        }
      });
    }

    revalidatePath('/admin/penilaian-khusus');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || 'Gagal menyimpan preset' };
  }
}

export async function getPresetBobot(kategori: string) {
  try {
    const template = await db.nonTeachingGradeTemplate.findFirst({
      where: { nama: kategori },
      include: {
        components: true
      }
    });

    return { success: true, components: template?.components || [] };
  } catch (error: any) {
    return { error: 'Gagal mengambil preset' };
  }
}

export async function saveNilaiKhusus(nim: string, kategori: string, scores: { componentId: string; nilai: number }[]) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };

  try {
    // Cari Mahasiswa
    const mahasiswa = await db.mahasiswa.findUnique({
      where: { nim }
    });

    if (!mahasiswa) {
      return { error: 'Mahasiswa tidak ditemukan' };
    }

    // Cari Template
    const template = await db.nonTeachingGradeTemplate.findFirst({
      where: { nama: kategori },
      include: { components: true }
    });

    if (!template) {
      return { error: 'Preset bobot belum diatur untuk kategori ini' };
    }

    // Buat atau Cari Mata Kuliah & Kelas Dummy untuk Kategori ini
    let mk = await db.mataKuliah.findUnique({
      where: { kodeMk: kategori.toUpperCase() }
    });

    if (!mk) {
      mk = await db.mataKuliah.create({
        data: {
          kodeMk: kategori.toUpperCase(),
          namaMk: kategori.toUpperCase(),
          sks: 0,
        }
      });
    }

    // Cari Kelas Dummy, assuming dummy Dosen is the first one or we just create a Dosen if none
    let dosen = await db.dosen.findFirst();
    if (!dosen) {
      // Create a dummy user and dosen if no dosen exists (rare case, but safe)
       return { error: 'Sistem membutuhkan minimal 1 dosen terdaftar untuk membuat kelas' };
    }

    let kelas = await db.kelas.findFirst({
      where: { mataKuliahId: mk.id, namaKelas: 'NON-TEACHING' }
    });

    if (!kelas) {
      kelas = await db.kelas.create({
        data: {
          mataKuliahId: mk.id,
          namaKelas: 'NON-TEACHING',
          dosenId: dosen.id,
        }
      });
    }

    // Cari atau Buat Enrollment
    let enrollment = await db.enrollment.findUnique({
      where: {
        mahasiswaId_kelasId: {
          mahasiswaId: mahasiswa.id,
          kelasId: kelas.id
        }
      }
    });

    if (!enrollment) {
      enrollment = await db.enrollment.create({
        data: {
          mahasiswaId: mahasiswa.id,
          kelasId: kelas.id,
          nonTeachingTemplateId: template.id
        }
      });
    } else {
      await db.enrollment.update({
        where: { id: enrollment.id },
        data: { nonTeachingTemplateId: template.id }
      });
    }

    // Hitung Nilai Total
    let totalScore = 0;
    let totalWeight = 0;

    // Simpan Scores
    for (const score of scores) {
      const comp = template.components.find(c => c.id === score.componentId);
      if (comp) {
        totalScore += score.nilai * comp.bobot;
        totalWeight += comp.bobot;
      }

      const existingScore = await db.nonTeachingGradeScore.findUnique({
        where: {
          enrollmentId_componentId: {
            enrollmentId: enrollment.id,
            componentId: score.componentId
          }
        }
      });

      if (existingScore) {
        await db.nonTeachingGradeScore.update({
          where: { id: existingScore.id },
          data: { nilai: score.nilai }
        });
      } else {
        await db.nonTeachingGradeScore.create({
          data: {
            enrollmentId: enrollment.id,
            componentId: score.componentId,
            nilai: score.nilai
          }
        });
      }
    }

    // Update Nilai Akhir
    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    
    // Hitung Huruf
    let huruf = 'E';
    if (finalScore >= 85) huruf = 'A';
    else if (finalScore >= 80) huruf = 'A-';
    else if (finalScore >= 75) huruf = 'B+';
    else if (finalScore >= 70) huruf = 'B';
    else if (finalScore >= 65) huruf = 'C+';
    else if (finalScore >= 60) huruf = 'C';
    else if (finalScore >= 50) huruf = 'D';

    await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        nilaiAkhir: finalScore,
        nilaiTotal: finalScore,
        huruf: huruf
      }
    });

    revalidatePath('/admin/penilaian-khusus');
    return { success: true, finalScore };
  } catch (error: any) {
    console.error(error);
    return { error: 'Gagal menyimpan nilai' };
  }
}

export async function getNilaiKhususPreview() {
  try {
    const enrollments = await db.enrollment.findMany({
      where: {
        nonTeachingTemplateId: { not: null }
      },
      include: {
        mahasiswa: true,
        nonTeachingTemplate: true,
        nonTeachingScores: true,
        kelas: {
          include: { mataKuliah: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 20
    });

    return { success: true, enrollments };
  } catch (error: any) {
    console.error(error);
    return { error: 'Gagal mengambil preview nilai' };
  }
}

export async function deleteNilaiKhusus(enrollmentId: string) {
  if (!(await isAdmin())) return { error: 'Unauthorized' };

  try {
    await db.enrollment.delete({
      where: { id: enrollmentId }
    });
    revalidatePath('/admin/penilaian-khusus');
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { error: 'Gagal menghapus nilai' };
  }
}

export async function getMahasiswaPreview(nim: string) {
  try {
    const mahasiswa = await db.mahasiswa.findUnique({
      where: { nim: nim.toUpperCase() },
      select: { name: true, nim: true, angkatan: true }
    });
    return { success: true, mahasiswa };
  } catch (error) {
    return { error: 'Terjadi kesalahan' };
  }
}

export async function searchMahasiswa(query: string) {
  try {
    const mahasiswa = await db.mahasiswa.findMany({
      where: {
        OR: [
          { nim: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: { name: true, nim: true, angkatan: true },
      take: 5
    });
    return { success: true, mahasiswa };
  } catch (error) {
    return { error: 'Gagal mencari mahasiswa' };
  }
}

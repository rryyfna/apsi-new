'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import * as XLSX from 'xlsx';
import { headers } from 'next/headers';

async function isAdminOrKaprodi() {
  const headersList = await headers();
  const role = headersList.get('x-user-role');
  return role === 'ADMIN' || role === 'KAPRODI';
}

export async function importCpmkCplExcel(formData: FormData) {
  if (!(await isAdminOrKaprodi())) return { error: 'Unauthorized' };

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'File tidak ditemukan' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Assuming the Excel has a sheet named 'CPMK' and 'CPL'
    // Format CPMK: Kode MK, Kode CPMK, Deskripsi (ID), Deskripsi (EN)
    // Format CPL: Kode CPL, Deskripsi (ID), Deskripsi (EN)
    
    let cpmkCount = 0;
    let skippedCpmk = 0;
    let cplCount = 0;

    const sheetNames = workbook.SheetNames.map(s => s.toUpperCase());
    const cpmkSheetName = workbook.SheetNames.find(s => s.toUpperCase().includes('CPMK'));
    const cplSheetName = workbook.SheetNames.find(s => s.toUpperCase().includes('CPL'));

    if (cpmkSheetName) {
      const cpmkSheet = workbook.Sheets[cpmkSheetName];
      const cpmkData: any[] = XLSX.utils.sheet_to_json(cpmkSheet);
      for (const row of cpmkData) {
        // Normalize keys to support case-insensitive headers
        const normalizedRow: any = {};
        for (const key in row) {
          normalizedRow[key.toString().trim().toUpperCase()] = row[key];
        }

        const kodeMk = normalizedRow['KODE MK'] || normalizedRow['KODE_MK'] || normalizedRow['KODE MATA KULIAH'];
        const kodeCpmk = normalizedRow['KODE CPMK'] || normalizedRow['KODE_CPMK'] || normalizedRow['CPMK'];
        const deskripsiId = normalizedRow['DESKRIPSI (ID)'] || normalizedRow['DESKRIPSI'];
        const deskripsiEn = normalizedRow['DESKRIPSI (EN)'] || normalizedRow['DESKRIPSI EN'] || normalizedRow['DESKRIPSI_EN'];

        if (kodeMk && kodeCpmk && deskripsiId) {
          const mk = await db.mataKuliah.findUnique({ where: { kodeMk: kodeMk.toString().trim() } });
          if (mk) {
            await db.cPMK.upsert({
              where: {
                mataKuliahId_kode: {
                  mataKuliahId: mk.id,
                  kode: kodeCpmk.toString().trim()
                }
              },
              update: {
                deskripsi: deskripsiId.toString().trim(),
                deskripsiEn: deskripsiEn ? deskripsiEn.toString().trim() : null
              },
              create: {
                mataKuliahId: mk.id,
                kode: kodeCpmk.toString().trim(),
                deskripsi: deskripsiId.toString().trim(),
                deskripsiEn: deskripsiEn ? deskripsiEn.toString().trim() : null
              }
            });
            cpmkCount++;
          } else {
            skippedCpmk++;
          }
        }
      }
    }

    if (cplSheetName) {
      const cplSheet = workbook.Sheets[cplSheetName];
      const cplData: any[] = XLSX.utils.sheet_to_json(cplSheet);
      for (const row of cplData) {
        const normalizedRow: any = {};
        for (const key in row) {
          normalizedRow[key.toString().trim().toUpperCase()] = row[key];
        }

        const kodeCpl = normalizedRow['KODE CPL'] || normalizedRow['KODE_CPL'] || normalizedRow['CPL'];
        const deskripsiId = normalizedRow['DESKRIPSI (ID)'] || normalizedRow['DESKRIPSI'];
        const deskripsiEn = normalizedRow['DESKRIPSI (EN)'] || normalizedRow['DESKRIPSI EN'] || normalizedRow['DESKRIPSI_EN'];

        if (kodeCpl && deskripsiId) {
          await db.cPL.upsert({
            where: { kode: kodeCpl.toString().trim() },
            update: {
              deskripsi: deskripsiId.toString().trim(),
              deskripsiEn: deskripsiEn ? deskripsiEn.toString().trim() : null
            },
            create: {
              kode: kodeCpl.toString().trim(),
              deskripsi: deskripsiId.toString().trim(),
              deskripsiEn: deskripsiEn ? deskripsiEn.toString().trim() : null
            }
          });
          cplCount++;
        }
      }
    }

    revalidatePath('/admin/cpl');
    revalidatePath('/kaprodi/cpmk');
    const skippedMsg = skippedCpmk > 0 ? ` (${skippedCpmk} CPMK dilewati karena Kode MK tidak ditemukan di database)` : '';
    return { success: true, message: `Berhasil mengimpor ${cpmkCount} CPMK dan ${cplCount} CPL.${skippedMsg}` };
  } catch (error: any) {
    console.error('Import Error:', error);
    return { error: 'Gagal membaca atau memproses file Excel.' };
  }
}

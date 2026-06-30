const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Generating default KelasCpmkKolomNilai mappings...');
  
  const kelasList = await prisma.kelas.findMany({
    include: {
      mataKuliah: {
        include: {
          cpmk: true
        }
      }
    }
  });

  let createdCount = 0;

  for (const kelas of kelasList) {
    if (!kelas.mataKuliah.cpmk || kelas.mataKuliah.cpmk.length === 0) continue;
    
    // Each CPMK gets 1/N of the total class bobot, or just full 100% split across Tugas/UTS/UAS.
    // If CPMK is evaluated by ALL assignments, we just create columns for each CPMK.
    
    const bobot = [
      { baseName: 'Tugas', val: kelas.bobotTugas || 20 },
      { baseName: 'UTS', val: kelas.bobotUts || 30 },
      { baseName: 'UAS', val: kelas.bobotUas || 30 },
      { baseName: 'Partisipasi', val: kelas.bobotPartisipasi || 10 },
      { baseName: 'Proyek', val: kelas.bobotProyek || 10 },
    ];

    for (const cpmk of kelas.mataKuliah.cpmk) {
      for (const b of bobot) {
        if (b.val > 0) {
          const colName = `${b.baseName} (${cpmk.kode})`;
          
          await prisma.kelasCpmkKolomNilai.upsert({
            where: {
              kelasId_namaKolom: {
                kelasId: kelas.id,
                namaKolom: colName
              }
            },
            update: { bobot: b.val },
            create: {
              kelasId: kelas.id,
              cpmkId: cpmk.id,
              namaKolom: colName,
              bobot: b.val
            }
          });
          createdCount++;
        }
      }
    }
  }
  
  console.log('Finished generating ' + createdCount + ' kolom nilai!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

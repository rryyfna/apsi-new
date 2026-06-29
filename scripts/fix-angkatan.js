const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const mahasiswas = await prisma.mahasiswa.findMany();
  let updated = 0;
  
  for (const mhs of mahasiswas) {
    if (mhs.nim && mhs.nim.length >= 5) {
      // e.g. I0323037 -> 2023
      const match = mhs.nim.match(/^[A-Za-z0-9]{3}(\d{2})\d+$/);
      if (match && match[1]) {
        const angkatanStr = "20" + match[1];
        await prisma.mahasiswa.update({
          where: { id: mhs.id },
          data: { angkatan: angkatanStr }
        });
        updated++;
      }
    }
  }
  
  console.log(`Successfully updated ${updated} mahasiswa with their angkatan.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

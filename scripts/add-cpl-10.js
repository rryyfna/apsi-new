const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const cplData = [
    { kode: 'CPL-5', deskripsi: 'Pengembangan Diri' },
    { kode: 'CPL-6', deskripsi: 'Kemampuan Manajerial' },
    { kode: 'CPL-7', deskripsi: 'Kewirausahaan dan Inovasi' },
    { kode: 'CPL-8', deskripsi: 'Kerjasama Tim' },
    { kode: 'CPL-9', deskripsi: 'Etika Profesi' },
    { kode: 'CPL-10', deskripsi: 'Komunikasi Efektif' },
  ];

  for (const cpl of cplData) {
    await prisma.cPL.upsert({
      where: { kode: cpl.kode },
      update: {},
      create: {
        kode: cpl.kode,
        deskripsi: cpl.deskripsi
      }
    });
  }
  
  console.log("CPL 5-10 have been added to the database!");
}

run().catch(console.error).finally(() => prisma.$disconnect());

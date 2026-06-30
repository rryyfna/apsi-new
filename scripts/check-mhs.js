const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const count = await prisma.mahasiswa.count();
  console.log('Total Mahasiswa in DB:', count);
  const angkatan22 = await prisma.mahasiswa.count({ where: { angkatan: 2022 }});
  console.log('Mahasiswa Angkatan 2022:', angkatan22);
}
run().catch(console.error).finally(() => prisma.$disconnect());

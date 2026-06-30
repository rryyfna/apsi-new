const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const c = await prisma.kelasCpmkKolomNilai.count();
  console.log("Total Kolom Nilai created:", c);
}
run().catch(console.error).finally(() => prisma.$disconnect());

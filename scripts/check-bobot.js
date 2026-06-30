const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const m = await prisma.cpmkKolomNilai.findFirst();
  console.log('Sample cpmkKolomNilai:', m);
}
run().catch(console.error).finally(() => prisma.$disconnect());

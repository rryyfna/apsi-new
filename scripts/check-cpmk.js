const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const c = await prisma.cPMK.count();
  console.log("Total CPMK:", c);
}
run().catch(console.error).finally(() => prisma.$disconnect());

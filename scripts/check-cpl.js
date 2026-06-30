const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const cpls = await prisma.cPL.findMany({ orderBy: { kode: 'asc' } });
  console.log('CPLs:', cpls.map(c => c.kode));
}
run().catch(console.error).finally(() => prisma.$disconnect());

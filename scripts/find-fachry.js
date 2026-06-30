const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const m = await prisma.user.findMany({
    where: { name: { contains: 'Fachry', mode: 'insensitive' } }
  });
  console.log('Found:', m);
}
run().catch(console.error).finally(() => prisma.$disconnect());

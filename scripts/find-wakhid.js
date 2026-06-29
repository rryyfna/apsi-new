const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dosen = await prisma.dosen.findFirst({
    where: { name: { contains: 'Wakhid', mode: 'insensitive' } },
    include: { user: true }
  });
  console.log(JSON.stringify(dosen, null, 2));
}
main().finally(() => prisma.$disconnect());

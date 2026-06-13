const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const mahasiswa = await prisma.mahasiswa.findMany({
    take: 5,
    select: {
      nim: true,
      name: true,
      user: {
        select: { name: true }
      }
    }
  });
  console.log("Samples from DB:", mahasiswa);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

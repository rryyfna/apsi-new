import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Cek apakah Kaprodi user sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { username: 'kaprodi123' },
  });

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        username: 'kaprodi123',
        password: 'password123',
        name: 'Dr. Kaprodi, M.Kom',
        role: 'KAPRODI',
      },
    });

    await prisma.kaprodi.create({
      data: {
        userId: user.id,
        name: 'Dr. Kaprodi, M.Kom',
      },
    });
    console.log('Akun Kaprodi berhasil dibuat: Username: kaprodi123, Password: password123');
  } else {
    console.log('Akun Kaprodi sudah ada. Username: kaprodi123, Password: password123');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

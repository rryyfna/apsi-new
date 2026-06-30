const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function run() {
  const hash = await bcrypt.hash('password123', 10);
  await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        username: 'testmhs@student.uns.ac.id',
        password: hash,
        name: 'Test Mhs',
        role: 'MAHASISWA',
        isApproved: true
      }
    });
    await tx.mahasiswa.create({
      data: {
        userId: newUser.id,
        nim: 'I0321000',
        name: 'Test Mhs',
        fakultas: 'Teknik',
        programStudi: 'Teknik Industri',
        angkatan: '2021'
      }
    });
  });
  console.log('Transaction success!');
}
run().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: hashedPassword, role: 'ADMIN', isApproved: true },
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
      isApproved: true
    }
  });
  console.log('Admin user ensured. Username: admin, Password: password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

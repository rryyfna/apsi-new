const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function run() {
  const hash = await bcrypt.hash('password123', 10);
  await prisma.user.update({
    where: { username: 'fachrynaufal@student.uns.ac.id' },
    data: { password: hash }
  });
  console.log('Password reset successfully!');
}
run().catch(console.error).finally(() => prisma.$disconnect());

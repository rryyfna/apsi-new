const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const c = await prisma.enrollment.count();
  console.log('Total Enrollments:', c);
}
run().catch(console.error).finally(() => prisma.$disconnect());

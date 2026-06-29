const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.updateMany({where: {isApproved: false}, data: {isApproved: true}})
  .then(() => console.log('All pending accounts approved!'))
  .finally(() => prisma.$disconnect());

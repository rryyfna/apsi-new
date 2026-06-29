const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findUnique({where: {username: 'kaprodi123'}}).then(console.log).finally(() => prisma.$disconnect());

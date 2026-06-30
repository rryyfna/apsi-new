const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.upsert({
    where: { username: "wakhidjauhari@staff.uns.ac.id" },
    update: {},
    create: {
      username: "wakhidjauhari@staff.uns.ac.id",
      password: "password",
      name: "Wakhid Ahmad Jauhari",
      role: "KAPRODI",
    }
  });
  console.log("Created Kaprodi User:", user);
  const kaprodi = await prisma.kaprodi.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      name: "Wakhid Ahmad Jauhari"
    }
  });
  console.log("Created Kaprodi Record:", kaprodi);
}
run().catch(console.error).finally(() => prisma.$disconnect());

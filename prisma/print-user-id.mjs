import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.argv[2] || "seed-owner@example.com";

try {
  const user = await prisma.user.findUnique({ where: { email } });
  console.log(user?.id ?? "");
} finally {
  await prisma.$disconnect();
}









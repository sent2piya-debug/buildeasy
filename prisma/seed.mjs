import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "seed-owner@example.com" },
    update: {},
    create: {
      email: "seed-owner@example.com",
      name: "Seed Owner",
      role: "SELLER",
      phone: "0000000000",
    },
  });

  await prisma.listing.create({
    data: {
      title: "Approved Sample Listing",
      type: "LAND",
      landSizeSqm: 500,
      priceMin: 10000,
      priceMax: 15000,
      province: "Sample Province",
      district: "Sample District",
      photos: ["/sample1.jpg"],
      description: "Seeded approved listing",
      status: "APPROVED",
      owner: { connect: { id: user.id } },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });




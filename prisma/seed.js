// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const base = [
    {
      landSizeSqm: 300,
      priceMin: 2000000,
      priceMax: 3000000,
      province: "Pathum Thani",
      district: "Thanyaburi",
      type: "HOUSE"
    },
    {
      landSizeSqm: 400,
      priceMin: 2500000,
      priceMax: 3500000,
      province: "Bangkok",
      district: "Bang Kapi",
      type: "LAND"
    }
  ];

  const listings = [];

  for (let i = 0; i < 12; i++) {
    const t = i % base.length;
    const label = `${base[t].type === "LAND" ? "Land" : "House"} #${i + 1}`;
    const cover = `https://placehold.co/800x600/jpg?text=${encodeURIComponent(label)}`;

    listings.push({
      title: label,
      landSizeSqm: base[t].landSizeSqm + i * 10,
      priceMin: base[t].priceMin + i * 50000,
      priceMax: base[t].priceMax + i * 50000,
      province: base[t].province,
      district: base[t].district,
      type: base[t].type,
      photos: [cover],
      status: i % 3 === 0 ? "PENDING" : "APPROVED", // ~1/3 pending
    });
  }

  await prisma.listing.createMany({ data: listings });

  console.log("✅ Seed complete");
  console.log(`Listings created: ${listings.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

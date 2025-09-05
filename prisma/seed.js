// prisma/seed.js (CommonJS)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1) Demo users
  const admin = await prisma.user.upsert({
    where: { email: "admin@buildeasy.dev" },
    update: {},
    create: { email: "admin@buildeasy.dev", role: "ADMIN", name: "Admin" },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@buildeasy.dev" },
    update: {},
    create: { email: "seller@buildeasy.dev", role: "SELLER", name: "Demo Seller", phone: "080-000-0000" },
  });

  const buyer = await prisma.user.upsert({
    where: { email: "buyer@buildeasy.dev" },
    update: {},
    create: { email: "buyer@buildeasy.dev", role: "BUYER", name: "Demo Buyer" },
  });

  // 2) Demo listings (mix of APPROVED & PENDING)
  const base = [
    {
      title: "Land near Ramkhamhaeng",
      type: "LAND",
      landSizeSqm: 320,
      priceMin: 1800000,
      priceMax: 2200000,
      province: "Bangkok",
      district: "Bang Kapi",
      photos: ["https://placehold.co/800x600?text=Land+Ram"],
      description: "Flat plot with access road.",
      status: "APPROVED",
      ownerId: seller.id,
    },
    {
      title: "House in Thanyaburi",
      type: "HOUSE",
      landSizeSqm: 200,
      priceMin: 2500000,
      priceMax: 2900000,
      province: "Pathum Thani",
      district: "Thanyaburi",
      photos: ["https://placehold.co/800x600?text=House+PT"],
      description: "3BR, 2BA, near Rangsit.",
      status: "PENDING",
      ownerId: seller.id,
    },
  ];

  // Grow to ~12 items
  const listings = [];
  for (let i = 0; i < 12; i++) {
    const t = i % base.length;
    listings.push({
      ...base[t],
      title:
        t === 0
          ? `Land Plot #${i + 1} (Bangkok)`
          : `House #${i + 1} (Pathum Thani)`,
      landSizeSqm: base[t].landSizeSqm + i * 20,
      priceMin: base[t].priceMin + i * 40000,
      priceMax: base[t].priceMax + i * 40000,
      photos: [
        `https://placehold.co/800x600?text=${encodeURIComponent(
          (t === 0 ? "Land+" : "House+") + (i + 1)
        )}`,
      ],
      status: i % 3 === 0 ? "PENDING" : "APPROVED", // ~1/3 pending
    });
  }

  await prisma.listing.createMany({ data: listings });

  console.log("✅ Seed complete:");
  console.log(`  Admin:  ${admin.email}`);
  console.log(`  Seller: ${seller.email}`);
  console.log(`  Buyer:  ${buyer.email}`);
  console.log(`  Listings created: ${listings.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



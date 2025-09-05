import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const items = await prisma.listing.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, province: true, district: true, widthM: true, lengthM: true, landSizeSqm: true, createdAt: true },
  });
  return NextResponse.json(items);
}



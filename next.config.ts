import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params; // ⚡ Next.js 15 requires await
  const updated = await prisma.listing.update({
    where: { id },
    data: { status: "APPROVED" },
  });
  return NextResponse.json(updated);
}

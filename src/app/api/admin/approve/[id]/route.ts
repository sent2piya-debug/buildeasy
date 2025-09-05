import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Approve a listing by ID
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const updated = await prisma.listing.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Listing not found or update failed" },
      { status: 400 }
    );
  }
}



import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Reject a listing by ID
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const updated = await prisma.listing.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Listing not found or update failed" },
      { status: 400 }
    );
  }
}











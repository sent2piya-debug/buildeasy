import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const listingSchema = z.object({
  title: z.string(),
  type: z.enum(["LAND", "HOUSE", "SERVICE"]),
  priceMin: z.number().int().nonnegative(),
  priceMax: z.number().int().nonnegative(),
  province: z.string(),
  district: z.string(),
  landSizeSqm: z.number().int().nonnegative().optional(),
  widthMeters: z.number().nonnegative().optional(),
  lengthMeters: z.number().nonnegative().optional(),
  photos: z.array(z.string()).default([])
});

type ListingInput = z.infer<typeof listingSchema>;

export async function GET() {
  const rows = await prisma.listing.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const raw = await req.json();
  const parsed = listingSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.format() },
      { status: 400 }
    );
  }

  const data: ListingInput = parsed.data;

  // Auto-calc land size if width/length present
  if (!data.landSizeSqm && data.widthMeters && data.lengthMeters) {
    data.landSizeSqm = Math.round(data.widthMeters * data.lengthMeters);
  }

  const userId = req.headers.get("x-user-id") ?? "seeded-user";

  const created = await prisma.listing.create({
    data: {
      ...data,
      sellerId: userId,
      status: "PENDING"
    }
  });

  return NextResponse.json(created, { status: 201 });
}

// Make sure your error branches use `unknown`, not `any`
export function onError(err: unknown) {
  const message = err instanceof Error ? err.message : "Unknown error";
  return NextResponse.json({ error: message }, { status: 500 });
}

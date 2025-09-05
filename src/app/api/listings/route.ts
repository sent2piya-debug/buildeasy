import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createListingSchema = z
  .object({
    title: z.string().min(1),
    type: z.enum(["LAND", "HOUSE", "SERVICE"]),
    widthM: z.number().positive().optional(),
    lengthM: z.number().positive().optional(),
    landSizeSqm: z.number().int().positive().optional(),
    priceMin: z.number().optional(),
    priceMax: z.number().optional(),
    province: z.string().min(1),
    district: z.string().min(1),
    photos: z.array(z.string()).optional(),
    description: z.string().optional(),
    ownerId: z.string().min(1).optional(),
    ownerEmail: z.string().email().optional(),
  })
  .refine((data) => !!(data.ownerId || data.ownerEmail), {
    message: "ownerId or ownerEmail required",
    path: ["ownerId"],
  });

// Mock auth guard: require header x-user-role: SELLER
function requireSellerRole(req: Request) {
  const role = req.headers.get("x-user-role");
  if (role !== "SELLER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      select: ({
        id: true,
        title: true,
        type: true,
        widthM: true,
        lengthM: true,
        landSizeSqm: true,
        priceMin: true,
        priceMax: true,
        province: true,
        district: true,
        photos: true,
        createdAt: true,
      }) as any,
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("GET /api/listings error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const forbidden = requireSellerRole(req);
  if (forbidden) return forbidden;

  try {
    const json = await req.json();
    const body = createListingSchema.parse(json);

    let resolvedOwnerId: string | undefined = body.ownerId;
    if (!resolvedOwnerId && body.ownerEmail) {
      const owner = await prisma.user.findUnique({
        where: { email: body.ownerEmail },
        select: { id: true },
      });
      if (!owner) {
        return NextResponse.json({ error: "Owner email not found" }, { status: 400 });
      }
      resolvedOwnerId = owner.id;
    }
    if (!resolvedOwnerId) {
      return NextResponse.json({ error: "ownerId or ownerEmail required" }, { status: 400 });
    }

    const widthM = body.widthM ?? null;
    const lengthM = body.lengthM ?? null;
    const sqm = widthM && lengthM ? widthM * lengthM : body.landSizeSqm ?? null;

    const data: any = {
      title: body.title,
      type: body.type,
      widthM,
      lengthM,
      landSizeSqm: sqm,
      priceMin: body.priceMin ?? null,
      priceMax: body.priceMax ?? null,
      province: body.province,
      district: body.district,
      photos: Array.isArray(body.photos) ? body.photos : [],
      description: body.description ?? null,
      status: "PENDING",
      ownerId: resolvedOwnerId,
    };

    const listing = await prisma.listing.create({
      data,
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid body", details: error.flatten() }, { status: 400 });
    }
    console.error("POST /api/listings error", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}


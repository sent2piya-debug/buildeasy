
import { NextResponse } from "next/server";
// define yout own context for clarity
type ApproveRouteContext = { params: { id: string } };

export async function POST( request: Request, context: ApproveRouteContext) {
    const { id } = context.params

  // TODO: your Prisma approval goes here
  // await prisma.listing.update({
  //   where: { id },
  //   data: { status: "APPROVED" },
  // });

  return NextResponse.json({ ok: true, id });
}



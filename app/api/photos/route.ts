import { NextRequest, NextResponse } from "next/server";
import {
  addPropertyPhoto,
  listPhotosForCustomer,
  listUnassignedPhotos,
} from "@/lib/db";

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get("customer_id");
  const photos = customerId
    ? await listPhotosForCustomer(Number(customerId))
    : await listUnassignedPhotos();
  return NextResponse.json({ photos });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (typeof body.url !== "string" || !body.url.startsWith("https://")) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }
  if (!body.lead_id && !body.customer_id) {
    return NextResponse.json(
      { error: "lead_id or customer_id is required" },
      { status: 400 }
    );
  }

  const photo = await addPropertyPhoto({
    url: body.url,
    caption: body.caption,
    lead_id: body.lead_id ? Number(body.lead_id) : undefined,
    customer_id: body.customer_id ? Number(body.customer_id) : undefined,
  });

  return NextResponse.json({ photo });
}

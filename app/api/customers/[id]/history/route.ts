import { NextRequest, NextResponse } from "next/server";
import { addServiceHistoryEntry, listServiceHistory } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const history = await listServiceHistory(Number(id));
    return NextResponse.json({ history });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.service_date || !body.service_type) {
      return NextResponse.json(
        { error: "service_date and service_type are required" },
        { status: 400 }
      );
    }

    const entry = await addServiceHistoryEntry({
      customer_id: Number(id),
      service_date: body.service_date,
      service_type: body.service_type,
      price_charged: body.price_charged ? Number(body.price_charged) : undefined,
      notes: body.notes,
    });

    return NextResponse.json({ entry });
  } catch (err) {
    return apiError(err);
  }
}

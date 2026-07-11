import { NextRequest, NextResponse } from "next/server";
import { convertLeadToCustomer } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await convertLeadToCustomer(Number(id));
    return NextResponse.json({ customer });
  } catch (err) {
    return apiError(err);
  }
}

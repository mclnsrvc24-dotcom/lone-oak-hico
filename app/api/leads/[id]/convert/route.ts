import { NextRequest, NextResponse } from "next/server";
import { convertLeadToCustomer } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const customer = await convertLeadToCustomer(Number(id));
  return NextResponse.json({ customer });
}

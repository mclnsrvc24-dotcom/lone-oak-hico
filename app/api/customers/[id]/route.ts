import { NextRequest, NextResponse } from "next/server";
import { getCustomer, updateCustomer } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const customer = await getCustomer(Number(id));
  if (!customer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ customer });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  await updateCustomer(Number(id), body);
  return NextResponse.json({ ok: true });
}

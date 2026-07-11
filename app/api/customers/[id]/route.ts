import { NextRequest, NextResponse } from "next/server";
import { getCustomer, updateCustomer } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await getCustomer(Number(id));
    if (!customer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ customer });
  } catch (err) {
    return apiError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updateCustomer(Number(id), body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err);
  }
}

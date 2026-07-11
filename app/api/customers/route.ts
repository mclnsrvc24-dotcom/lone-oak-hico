import { NextResponse } from "next/server";
import { listCustomers } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET() {
  try {
    const customers = await listCustomers();
    return NextResponse.json({ customers });
  } catch (err) {
    return apiError(err);
  }
}

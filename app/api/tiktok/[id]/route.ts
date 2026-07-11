import { NextRequest, NextResponse } from "next/server";
import { deleteTikTokPost, updateTikTokPost } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updateTikTokPost(Number(id), body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteTikTokPost(Number(id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err);
  }
}

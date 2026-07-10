import { NextRequest, NextResponse } from "next/server";
import { deleteTikTokPost, updateTikTokPost } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  await updateTikTokPost(Number(id), body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteTikTokPost(Number(id));
  return NextResponse.json({ ok: true });
}

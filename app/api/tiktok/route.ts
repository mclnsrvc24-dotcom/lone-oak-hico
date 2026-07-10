import { NextRequest, NextResponse } from "next/server";
import { createTikTokPost, listTikTokPosts } from "@/lib/db";

export async function GET() {
  const posts = await listTikTokPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.idea || typeof body.idea !== "string") {
    return NextResponse.json({ error: "idea is required" }, { status: 400 });
  }

  const post = await createTikTokPost({
    idea: body.idea,
    caption: body.caption,
    planned_date: body.planned_date,
    status: body.status,
    notes: body.notes,
  });

  return NextResponse.json({ post });
}

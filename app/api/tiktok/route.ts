import { NextRequest, NextResponse } from "next/server";
import { createTikTokPost, listTikTokPosts } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET() {
  try {
    const posts = await listTikTokPosts();
    return NextResponse.json({ posts });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
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
  } catch (err) {
    return apiError(err);
  }
}

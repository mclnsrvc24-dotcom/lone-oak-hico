import { NextResponse } from "next/server";

// Route handlers must always return valid JSON, even on failure — an
// unhandled throw makes Next.js return an HTML error page, which breaks
// client code calling res.json() with a confusing "Unexpected end of JSON
// input" error instead of a real message.
export function apiError(err: unknown, status = 500) {
  console.error(err);
  const message = err instanceof Error ? err.message : "Unexpected server error";
  return NextResponse.json({ error: message }, { status });
}

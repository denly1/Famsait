import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, event_type = "pageview", meta, session_id, referrer } = body;

    if (!path) return NextResponse.json({ ok: false }, { status: 400 });

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const user_agent = req.headers.get("user-agent") || "";

    await query(
      `INSERT INTO page_views (path, referrer, user_agent, ip, session_id, event_type, meta)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [path, referrer || null, user_agent, ip, session_id || null, event_type, meta ? JSON.stringify(meta) : null]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

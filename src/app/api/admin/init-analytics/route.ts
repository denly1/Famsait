import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id BIGSERIAL PRIMARY KEY,
        path TEXT NOT NULL,
        referrer TEXT,
        user_agent TEXT,
        ip TEXT,
        session_id TEXT,
        event_type TEXT NOT NULL DEFAULT 'pageview',
        meta TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await query(`CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_page_views_event_type ON page_views (event_type)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views (session_id)`);

    return NextResponse.json({ ok: true, message: "Tables created" });
  } catch (err) {
    console.error("init-analytics error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

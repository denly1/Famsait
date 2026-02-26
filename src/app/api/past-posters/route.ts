import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure table exists
    await query(`
      CREATE TABLE IF NOT EXISTS past_posters (
        id TEXT PRIMARY KEY,
        image TEXT NOT NULL,
        title TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    const result = await query("SELECT * FROM past_posters ORDER BY created_at DESC");
    return NextResponse.json({ posters: result.rows });
  } catch (err) {
    console.error("GET /api/past-posters error:", err);
    return NextResponse.json({ posters: [] });
  }
}

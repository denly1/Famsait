import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
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
    console.error("GET /api/admin/past-posters error:", err);
    return NextResponse.json({ posters: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.image) {
      return NextResponse.json({ error: "Изображение обязательно" }, { status: 400 });
    }
    const id = `poster-${Date.now()}`;
    await query(
      "INSERT INTO past_posters (id, image, title) VALUES ($1, $2, $3)",
      [id, data.image, data.title || ""]
    );
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/past-posters error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    await query("DELETE FROM past_posters WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/past-posters error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

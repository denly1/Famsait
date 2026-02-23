import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM messages ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET /api/admin/messages error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    await query("UPDATE messages SET read = true WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/admin/messages error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    const result = await query("DELETE FROM messages WHERE id = $1 RETURNING id", [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Сообщение не найдено" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/messages error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
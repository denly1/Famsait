import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM faq_items ORDER BY sort_order ASC, created_at DESC");
    return NextResponse.json({ faq: result.rows });
  } catch (err) {
    console.error("GET /api/admin/faq error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.question || !data.answer) {
      return NextResponse.json({ error: "Вопрос и ответ обязательны" }, { status: 400 });
    }
    
    const id = data.id || `faq-${Date.now()}`;
    const result = await query(
      `INSERT INTO faq_items (id, question, answer, sort_order) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, data.question, data.answer, data.sortOrder || 0]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/faq error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    const result = await query(
      `UPDATE faq_items SET question = $2, answer = $3, sort_order = $4 WHERE id = $1 RETURNING *`,
      [data.id, data.question, data.answer, data.sortOrder || 0]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Вопрос не найден" }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /api/admin/faq error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    const result = await query("DELETE FROM faq_items WHERE id = $1 RETURNING id", [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Вопрос не найден" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/faq error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

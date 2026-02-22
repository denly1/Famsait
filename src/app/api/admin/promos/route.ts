import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM promo_codes ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET /api/admin/promos error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.code || !data.discount) {
      return NextResponse.json({ error: "Код и скидка обязательны" }, { status: 400 });
    }
    
    const id = `promo-${Date.now()}`;
    const result = await query(
      `INSERT INTO promo_codes (id, code, discount, max_uses, current_uses, active, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, data.code, data.discount, data.maxUses || 100, 0, data.active !== false, data.expiresAt || '2026-12-31']
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/promos error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    const result = await query(
      "UPDATE promo_codes SET active = NOT active WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /api/admin/promos error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    const result = await query("DELETE FROM promo_codes WHERE id = $1 RETURNING id", [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/promos error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
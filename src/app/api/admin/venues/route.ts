import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM venues ORDER BY created_at DESC");
    return NextResponse.json({ venues: result.rows });
  } catch (err) {
    console.error("GET /api/admin/venues error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id || !data.name) {
      return NextResponse.json({ error: "ID и название обязательны" }, { status: 400 });
    }
    
    const result = await query(
      `INSERT INTO venues (id, name, address) VALUES ($1, $2, $3) RETURNING *`,
      [data.id, data.name, data.address || ""]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/venues error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    const result = await query(
      `UPDATE venues SET name = $2, address = $3 WHERE id = $1 RETURNING *`,
      [data.id, data.name, data.address || ""]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Площадка не найдена" }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /api/admin/venues error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    const result = await query("DELETE FROM venues WHERE id = $1 RETURNING id", [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Площадка не найдена" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/venues error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

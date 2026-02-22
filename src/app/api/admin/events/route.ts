import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM events ORDER BY date DESC");
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("GET /api/admin/events error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id || !data.title) {
      return NextResponse.json({ error: "ID и название обязательны" }, { status: 400 });
    }
    
    const result = await query(
      `INSERT INTO events (
        id, title, subtitle, date, time, venue, address, age_limit, 
        price, currency, image, description, lineup, features, is_past, 
        ticket_url, ticket_link
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        data.id, data.title, data.subtitle || "", data.date, data.time || "",
        data.venue || "", data.address || "", data.ageLimit || "18+",
        data.price || 0, data.currency || "₽", data.image || "",
        data.description || "", data.lineup || [], data.features || [],
        data.isPast || false, data.ticketUrl || "#", data.ticketLink || ""
      ]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/events error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...rest } = data;
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    const fields = Object.keys(rest);
    const values = Object.values(rest);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ");
    
    const result = await query(
      `UPDATE events SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /api/admin/events error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    
    const result = await query("DELETE FROM events WHERE id = $1 RETURNING id", [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/events error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
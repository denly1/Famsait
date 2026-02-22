import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET - получить все события
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPast = searchParams.get("isPast");

    let sql = "SELECT * FROM events";
    const params: any[] = [];

    if (isPast !== null) {
      sql += " WHERE is_past = $1";
      params.push(isPast === "true");
    }

    sql += " ORDER BY date DESC";

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      events: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - создать новое событие
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      subtitle,
      date,
      time,
      venue,
      address,
      age_limit,
      price,
      currency,
      image,
      description,
      lineup,
      features,
      is_past,
      ticket_url,
      ticket_link,
    } = body;

    const result = await query(
      `INSERT INTO events (
        id, title, subtitle, date, time, venue, address, age_limit, 
        price, currency, image, description, lineup, features, is_past, 
        ticket_url, ticket_link
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        id,
        title,
        subtitle || "",
        date,
        time || "",
        venue || "",
        address || "",
        age_limit || "18+",
        price || 0,
        currency || "₽",
        image || "",
        description || "",
        lineup || [],
        features || [],
        is_past || false,
        ticket_url || "#",
        ticket_link || "",
      ]
    );

    return NextResponse.json({
      success: true,
      event: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - обновить событие
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ");

    const result = await query(
      `UPDATE events SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - удалить событие
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    await query("DELETE FROM events WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

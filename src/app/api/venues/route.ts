import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET - получить все площадки
export async function GET() {
  try {
    const result = await query("SELECT * FROM venues ORDER BY name ASC");

    return NextResponse.json({
      success: true,
      venues: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - создать новую площадку
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, address } = body;

    const result = await query(
      `INSERT INTO venues (id, name, address)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, name, address || ""]
    );

    return NextResponse.json({
      success: true,
      venue: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error creating venue:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - обновить площадку
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, address } = body;

    const result = await query(
      `UPDATE venues SET name = $2, address = $3
       WHERE id = $1
       RETURNING *`,
      [id, name, address]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Venue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      venue: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating venue:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - удалить площадку
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Venue ID is required" },
        { status: 400 }
      );
    }

    await query("DELETE FROM venues WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Venue deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting venue:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

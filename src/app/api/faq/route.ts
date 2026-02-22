import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET - получить все FAQ
export async function GET() {
  try {
    const result = await query("SELECT * FROM faq_items ORDER BY sort_order ASC");

    return NextResponse.json({
      success: true,
      faq: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - создать новый FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, question, answer, sort_order } = body;

    const result = await query(
      `INSERT INTO faq_items (id, question, answer, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, question, answer, sort_order || 0]
    );

    return NextResponse.json({
      success: true,
      faq: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - обновить FAQ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, question, answer, sort_order } = body;

    const result = await query(
      `UPDATE faq_items SET question = $2, answer = $3, sort_order = $4
       WHERE id = $1
       RETURNING *`,
      [id, question, answer, sort_order]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      faq: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - удалить FAQ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "FAQ ID is required" },
        { status: 400 }
      );
    }

    await query("DELETE FROM faq_items WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET - получить настройки сайта
export async function GET() {
  try {
    const result = await query("SELECT * FROM site_settings WHERE id = 1");

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - обновить настройки
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      site_name,
      site_description,
      telegram_url,
      vk_url,
      instagram_url,
      email,
      address,
    } = body;

    const result = await query(
      `UPDATE site_settings SET 
        site_name = $1,
        site_description = $2,
        telegram_url = $3,
        vk_url = $4,
        instagram_url = $5,
        email = $6,
        address = $7
      WHERE id = 1
      RETURNING *`,
      [site_name, site_description, telegram_url, vk_url, instagram_url, email, address]
    );

    return NextResponse.json({
      success: true,
      settings: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

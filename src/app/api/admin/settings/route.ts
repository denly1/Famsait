import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM site_settings WHERE id = 1");
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Настройки не найдены" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("GET /api/admin/settings error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await query(
      `UPDATE site_settings SET 
        site_name = $1, site_description = $2, telegram_url = $3,
        vk_url = $4, instagram_url = $5, email = $6, address = $7
       WHERE id = 1 RETURNING *`,
      [
        data.siteName || data.site_name,
        data.siteDescription || data.site_description,
        data.telegramUrl || data.telegram_url,
        data.vkUrl || data.vk_url,
        data.instagramUrl || data.instagram_url,
        data.email,
        data.address
      ]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /api/admin/settings error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM site_content WHERE id = 1");
    if (result.rows.length === 0) {
      return NextResponse.json({
        heroHeading: "THE FAMILY",
        heroSubheading: "Организуем тусовки, которые ты запомнишь навсегда. Москва. Лучшие площадки. Невероятная атмосфера.",
        heroCtaText: "БЛИЖАЙШИЕ СОБЫТИЯ",
      });
    }
    
    const row = result.rows[0];
    return NextResponse.json({
      heroHeading: row.hero_heading,
      heroSubheading: row.hero_subheading,
      heroCtaText: row.hero_cta_text,
    });
  } catch (err) {
    console.error("GET /api/admin/content error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    const result = await query(
      `UPDATE site_content SET 
        hero_heading = $1, hero_subheading = $2, hero_cta_text = $3,
        updated_at = NOW()
      WHERE id = 1 RETURNING *`,
      [data.heroHeading, data.heroSubheading, data.heroCtaText]
    );
    
    if (result.rows.length === 0) {
      await query(
        `INSERT INTO site_content (id, hero_heading, hero_subheading, hero_cta_text)
         VALUES (1, $1, $2, $3)`,
        [data.heroHeading, data.heroSubheading, data.heroCtaText]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/admin/content error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

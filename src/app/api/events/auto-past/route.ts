import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Автоматически переносит события в прошедшие если дата прошла
export async function GET() {
  try {
    // Парсим дату формата DD.MM.YYYY и сравниваем с текущей датой
    const result = await query(`
      UPDATE events 
      SET is_past = true, updated_at = NOW()
      WHERE is_past = false AND (
        (is_double = true AND day2_date ~ '^[0-9]{2}\\.[0-9]{2}\\.[0-9]{4}$' AND TO_DATE(day2_date, 'DD.MM.YYYY') < CURRENT_DATE)
        OR
        ((is_double IS NOT TRUE OR day2_date !~ '^[0-9]{2}\\.[0-9]{2}\\.[0-9]{4}$') AND date ~ '^[0-9]{2}\\.[0-9]{2}\\.[0-9]{4}$' AND TO_DATE(date, 'DD.MM.YYYY') < CURRENT_DATE)
      )
      RETURNING id, title, date
    `);
    
    return NextResponse.json({ 
      success: true, 
      moved: result.rows.length,
      events: result.rows 
    });
  } catch (error: any) {
    console.error("Auto-past error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

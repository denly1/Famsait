import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM analytics WHERE id = 1");
    if (result.rows.length === 0) {
      return NextResponse.json({
        totalVisits: 0,
        todayVisits: 0,
        totalTicketClicks: 0,
        totalMessages: 0,
        popularEvents: []
      });
    }
    
    const row = result.rows[0];
    return NextResponse.json({
      totalVisits: row.total_visits || 0,
      todayVisits: row.today_visits || 0,
      totalTicketClicks: row.total_ticket_clicks || 0,
      totalMessages: 0,
      popularEvents: []
    });
  } catch (err) {
    console.error("GET /api/admin/analytics error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
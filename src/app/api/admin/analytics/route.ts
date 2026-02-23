import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT * FROM analytics WHERE id = 1");
    if (result.rows.length === 0) {
      return NextResponse.json({
        totalVisits: 0,
        totalTicketsSold: 0,
        totalRevenue: 0,
        activePromos: 0
      });
    }
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("GET /api/admin/analytics error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
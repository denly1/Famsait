import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/store-db";

export async function GET() {
  try {
    const analytics = await getAnalytics();
    return NextResponse.json(analytics);
  } catch (err) {
    console.error("GET /api/admin/analytics error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

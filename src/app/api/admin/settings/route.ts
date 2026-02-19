import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/store-db";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET /api/admin/settings error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const updated = await updateSettings(data);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/admin/settings error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

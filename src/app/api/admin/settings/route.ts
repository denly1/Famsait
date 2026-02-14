import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const updated = updateSettings(data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

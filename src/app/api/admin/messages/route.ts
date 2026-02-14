import { NextRequest, NextResponse } from "next/server";
import { getMessages, markMessageRead, deleteMessage } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getMessages());
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    markMessageRead(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const deleted = deleteMessage(id);
    if (!deleted) return NextResponse.json({ error: "Сообщение не найдено" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

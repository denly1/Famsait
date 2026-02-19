import { NextRequest, NextResponse } from "next/server";
import { getMessages, markMessageRead, deleteMessage } from "@/lib/store-db";

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (err) {
    console.error("GET /api/admin/messages error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    await markMessageRead(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/admin/messages error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const deleted = await deleteMessage(id);
    if (!deleted) return NextResponse.json({ error: "Сообщение не найдено" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/messages error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

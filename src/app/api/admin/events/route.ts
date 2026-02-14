import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getEvents());
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id || !data.title) {
      return NextResponse.json({ error: "ID и название обязательны" }, { status: 400 });
    }
    const event = createEvent(data);
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...rest } = data;
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const updated = updateEvent(id, rest);
    if (!updated) return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const deleted = deleteEvent(id);
    if (!deleted) return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

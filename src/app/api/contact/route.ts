import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/lib/store-db";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
    }
    // XSS sanitization
    const sanitize = (s: string) => s.replace(/[<>]/g, "").trim().slice(0, 1000);
    const msg = await createMessage({
      name: sanitize(name),
      email: sanitize(email),
      subject: sanitize(subject || ""),
      message: sanitize(message),
    });
    return NextResponse.json({ success: true, id: msg.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

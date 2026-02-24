import { NextRequest, NextResponse } from "next/server";
import { createToken, getAdminCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    // Валидация: только буквы, цифры и базовые символы
    if (!username || !password) {
      return NextResponse.json({ error: "Введите логин и пароль" }, { status: 400 });
    }

    if (username.length > 50 || password.length > 100) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    // Защита от SQL инъекций - проверка на подозрительные символы
    const sqlInjectionPattern = /['";\\--]/;
    if (sqlInjectionPattern.test(username) || sqlInjectionPattern.test(password)) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const creds = getAdminCredentials();

    if (username !== creds.username) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    if (password !== creds.password) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const token = await createToken(username);

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24h
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
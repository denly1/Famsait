import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/store-db";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, discount: 0, message: "Введите промокод" }, { status: 400 });
    }
    const result = await validatePromoCode(code.trim());
    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/promo error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

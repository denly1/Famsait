import { NextRequest, NextResponse } from "next/server";
import { getPromoCodes, createPromoCode, deletePromoCode, togglePromoCode } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getPromoCodes());
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.code || !data.discount) {
      return NextResponse.json({ error: "Код и скидка обязательны" }, { status: 400 });
    }
    const promo = createPromoCode(data);
    return NextResponse.json(promo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const toggled = togglePromoCode(id);
    if (!toggled) return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
    return NextResponse.json(toggled);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const deleted = deletePromoCode(id);
    if (!deleted) return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

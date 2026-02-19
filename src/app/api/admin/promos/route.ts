import { NextRequest, NextResponse } from "next/server";
import { getPromoCodes, createPromoCode, deletePromoCode, togglePromoCode } from "@/lib/store-db";

export async function GET() {
  try {
    const promos = await getPromoCodes();
    return NextResponse.json(promos);
  } catch (err) {
    console.error("GET /api/admin/promos error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.code || !data.discount) {
      return NextResponse.json({ error: "Код и скидка обязательны" }, { status: 400 });
    }
    const promo = await createPromoCode(data);
    return NextResponse.json(promo, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/promos error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const toggled = await togglePromoCode(id);
    if (!toggled) return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
    return NextResponse.json(toggled);
  } catch (err) {
    console.error("PUT /api/admin/promos error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const deleted = await deletePromoCode(id);
    if (!deleted) return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/promos error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

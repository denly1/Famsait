import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "userId обязателен" }, { status: 400 });
    }

    await query(
      `UPDATE support_messages SET is_read = true WHERE user_id = $1 AND sender = 'user' AND is_read = false`,
      [userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/admin/support/read error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

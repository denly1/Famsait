import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const result = await query(
        `SELECT id, user_id, text, sender, created_at as timestamp, is_read 
         FROM support_messages 
         WHERE user_id = $1 
         ORDER BY created_at ASC`,
        [userId]
      );

      const messages = result.rows.map((row: any) => ({
        id: row.id.toString(),
        userId: row.user_id,
        text: row.text,
        sender: row.sender,
        timestamp: row.timestamp,
        isRead: row.is_read,
      }));

      return NextResponse.json({ messages });
    }

    const result = await query(
      `SELECT 
        user_id,
        COUNT(*) as message_count,
        MAX(created_at) as last_message_at,
        SUM(CASE WHEN is_read = false AND sender = 'user' THEN 1 ELSE 0 END) as unread_count
       FROM support_messages 
       GROUP BY user_id 
       ORDER BY last_message_at DESC`
    );

    const conversations = result.rows.map((row: any) => ({
      userId: row.user_id,
      messageCount: parseInt(row.message_count),
      lastMessageAt: row.last_message_at,
      unreadCount: parseInt(row.unread_count),
    }));

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching support data:", error);
    return NextResponse.json({ error: "Failed to fetch support data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, text } = body;

    if (!userId || !text) {
      return NextResponse.json(
        { error: "userId and text are required" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO support_messages (user_id, text, sender, created_at, is_read) 
       VALUES ($1, $2, 'support', NOW(), true) 
       RETURNING id, user_id, text, sender, created_at as timestamp, is_read`,
      [userId, text]
    );

    await query(
      `UPDATE support_messages 
       SET is_read = true 
       WHERE user_id = $1 AND sender = 'user' AND is_read = false`,
      [userId]
    );

    const message = {
      id: result.rows[0].id.toString(),
      userId: result.rows[0].user_id,
      text: result.rows[0].text,
      sender: result.rows[0].sender,
      timestamp: result.rows[0].timestamp,
      isRead: result.rows[0].is_read,
    };

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error sending support reply:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}

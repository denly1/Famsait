import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, user_id, text, sender, created_at as timestamp, is_read 
       FROM support_messages 
       WHERE user_id = $1 
       ORDER BY created_at ASC`,
      [userId]
    );

    const messages = result.rows.map((row) => ({
      id: row.id.toString(),
      userId: row.user_id,
      text: row.text,
      sender: row.sender,
      timestamp: row.timestamp,
      isRead: row.is_read,
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, text, sender } = body;

    if (!userId || !text || !sender) {
      return NextResponse.json(
        { error: "userId, text, and sender are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO support_messages (user_id, text, sender, created_at, is_read) 
       VALUES ($1, $2, $3, NOW(), $4) 
       RETURNING id, user_id, text, sender, created_at as timestamp, is_read`,
      [userId, text, sender, sender === "support"]
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
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const DEFAULT_FAQ = [
  { id: "faq-1", question: "Где проходят мероприятия?", answer: "Наши события проходят на лучших площадках Москвы. Конкретный адрес указан на странице каждого мероприятия.", sortOrder: 1 },
  { id: "faq-2", question: "Как купить билет?", answer: "Нажмите кнопку «Купить билет» на странице события — вы перейдёте на страницу оплаты. Билеты также доступны у наших менеджеров в Telegram.", sortOrder: 2 },
  { id: "faq-3", question: "Какой возрастной ценз?", answer: "Большинство наших событий — 18+. Возрастное ограничение указано на странице каждого мероприятия. При входе может потребоваться паспорт.", sortOrder: 3 },
  { id: "faq-4", question: "Можно ли вернуть билет?", answer: "Возврат билетов возможен не позднее чем за 24 часа до начала мероприятия. Обратитесь к нам в поддержку или в Telegram.", sortOrder: 4 },
  { id: "faq-5", question: "Есть ли дресс-код?", answer: "На большинстве событий дресс-код отсутствует, но мы рекомендуем стильный образ. Особые требования указаны в описании конкретного мероприятия.", sortOrder: 5 },
  { id: "faq-6", question: "Как узнать о новых событиях первым?", answer: "Подпишитесь на наш Telegram-канал и группу ВКонтакте — там публикуются анонсы, эксклюзивные предложения и закрытые приглашения.", sortOrder: 6 },
];

export async function POST() {
  try {
    const existing = await query("SELECT COUNT(*) FROM faq_items");
    if (parseInt(existing.rows[0].count) > 0) {
      return NextResponse.json({ message: "FAQ уже заполнен", count: existing.rows[0].count });
    }
    for (const item of DEFAULT_FAQ) {
      await query(
        `INSERT INTO faq_items (id, question, answer, sort_order) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
        [item.id, item.question, item.answer, item.sortOrder]
      );
    }
    return NextResponse.json({ success: true, added: DEFAULT_FAQ.length });
  } catch (err) {
    console.error("FAQ seed error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

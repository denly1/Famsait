"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "Какие ближайшие мероприятия?",
  "Как купить билет?",
  "Есть ли дресс-код?",
  "Как работают промокоды?",
];

const KNOWLEDGE_BASE: Record<string, string> = {
  "мероприятия|событие|ближайш|вечеринк|тусовк": "Ближайшие мероприятия The Family:\n\n🎤 **UGLYSTEPHAN В МОСКВЕ** — 01.03.2026, BASE, промокод FAMILY\n💘 **TINDER PARTY** — 14.02.2026, ATMOSPHERE MOSCOW, от 500₽\n🎉 **NEON NIGHTS** — 22.02.2026, ARBAT HALL, от 500₽\n🎉 **FAMILY VIBES** — 08.03.2026, IZI, от 700₽\n🎉 **UNDERGROUND SESSION** — 15.03.2026, ANIMA, от 400₽\n\nВсе мероприятия можно посмотреть на странице /events",
  "билет|купить|оплат|заказ": "Билеты можно купить прямо на нашем сайте! Нажмите «Купить билет» на странице мероприятия. Принимаем оплату картой и через СБП. Билет придёт на вашу почту сразу после оплаты.",
  "дресс.код|одежд|что надеть|форма одежды": "На большинстве наших мероприятий дресс-код свободный — приходите в чём комфортно! Для тематических вечеринок (например, Halloween) мы указываем рекомендации в описании события.",
  "промокод|скидк|акци|купон": "Промокоды дают скидку на билеты! Введите промокод при покупке билета. Скидка применяется автоматически. Промокоды нельзя суммировать. Следите за нашим Telegram — там мы публикуем эксклюзивные промокоды!",
  "возраст|паспорт|18|21|лет": "Да, на наших мероприятиях есть возрастные ограничения (обычно 18+ или 21+). Ограничение указано на странице каждого события. Обязательно возьмите паспорт — на входе проверяют возраст.",
  "площадк|клуб|где|адрес|место": "Наши мероприятия проходят на лучших площадках Москвы:\n\n📍 ARBAT HALL — Новый Арбат, 21\n📍 IZI — Басманный пер., 8, стр. 1\n📍 ANIMA — Сущёвская ул., 21\n📍 VIBE — Бутырская ул., 46, стр. 1\n📍 BASE — ул. Орджоникидзе, 11, стр. 1\n📍 VK STADIUM — Ленинградский пр-т, 80, корп. 17\n📍 CASTLE HALL — м. Тушинская\n📍 PRAVDA — ул. Правды, 24, стр. 3",
  "возврат|вернуть|отмен": "Возврат билета возможен не позднее чем за 48 часов до начала мероприятия. Для возврата напишите нам на tusa2026@mail.ru с номером заказа.",
  "партнёр|сотрудничеств|бренд|реклам": "Мы открыты к сотрудничеству! Напишите на partners@family-moscow.ru или в Telegram @family_partners. Работаем с брендами, площадками, артистами и медиа.",
  "loyalty|баллы|уровень|привилеги|vip": "У нас есть программа лояльности Family Loyalty! Копите баллы за посещение мероприятий и получайте скидки до 25%, VIP-зону, backstage доступ и другие привилегии. Зарегистрируйтесь на главной странице!",
  "telegram|связ|контакт|написать": "Связаться с нами можно:\n\n📱 Telegram: @familymsk\n📧 Email: tusa2026@mail.ru\n� Instagram: @thefamily_msk\n🔵 VK: vk.ru/thefamilymskk\n\nИли заполните форму на странице /contacts",
};

function findAnswer(question: string): string {
  const q = question.toLowerCase();
  for (const [pattern, answer] of Object.entries(KNOWLEDGE_BASE)) {
    const keywords = pattern.split("|");
    if (keywords.some((kw) => q.includes(kw))) {
      return answer;
    }
  }
  return "Хороший вопрос! К сожалению, я не нашёл точного ответа. Рекомендую:\n\n• Раздел FAQ — /faq\n• Telegram — @familymsk\n• Форма на странице /contacts\n\nМы ответим в течение часа! 🙌";
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Привет! 👋 Я AI-ассистент The Family. Задай мне любой вопрос о наших мероприятиях, билетах или площадках!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const answer = findAnswer(text);
    setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    setTyping(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
          open
            ? "bg-bg-card border border-border rotate-0"
            : "bg-gradient-to-br from-primary to-accent animate-pulse-glow hover:scale-110"
        }`}
      >
        {open ? (
          <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] animate-scale-in">
          <div className="rounded-2xl bg-bg-card border border-border overflow-hidden shadow-2xl shadow-black/40 flex flex-col" style={{ height: "520px" }}>
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>AI Ассистент</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-text-muted">Онлайн</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/15 border border-primary/15 rounded-br-md"
                      : "bg-white/[0.03] border border-border rounded-bl-md"
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.03] border border-border">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-border text-[11px] text-text-secondary hover:text-primary hover:border-primary/20 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Задайте вопрос..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center hover:bg-primary/25 transition-colors disabled:opacity-30"
                >
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
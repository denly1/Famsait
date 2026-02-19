"use client";

import { useState, useRef, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Здравствуйте! Я онлайн-помощник THE FAMILY. Чем могу помочь?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(inputValue),
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAutoResponse = (userText: string): string => {
    const text = userText.toLowerCase();

    if (text.includes("билет") || text.includes("купить") || text.includes("цена")) {
      return "Билеты можно приобрести на странице МЕРОПРИЯТИЯ. Выберите интересующее событие и нажмите 'Купить билет'. Цены указаны на каждой афише.";
    }
    if (text.includes("возврат") || text.includes("отмена")) {
      return "Для возврата билета свяжитесь с нами через форму обратной связи на сайте. Укажите номер заказа и причину возврата.";
    }
    if (text.includes("место") || text.includes("площадка") || text.includes("адрес")) {
      return "Адреса площадок указаны на странице каждого мероприятия. Обычно мы проводим события в топовых клубах Москвы с отличным звуком и атмосферой.";
    }
    if (text.includes("возраст") || text.includes("18+") || text.includes("16+")) {
      return "Возрастные ограничения указаны на афише каждого мероприятия. Большинство наших событий 18+. При входе требуется паспорт.";
    }
    if (text.includes("промокод") || text.includes("скидка")) {
      return "Актуальные промокоды публикуются в наших социальных сетях: VK и Instagram. Подпишитесь, чтобы не пропустить!";
    }
    if (text.includes("контакт") || text.includes("связаться") || text.includes("телефон")) {
      return "Связаться с нами можно через:\n• VK: vk.ru/thefamilymskk\n• Instagram: @thefamily_msk\n• Форму обратной связи на сайте";
    }

    return "Спасибо за ваш вопрос! Наш менеджер свяжется с вами в ближайшее время. Следите за обновлениями в наших социальных сетях.";
  };

  return (
    <main className="min-h-screen bg-bg-dark pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1
              className="text-4xl sm:text-6xl font-black tracking-tight mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ПОДДЕРЖКА
            </h1>
            <p className="text-white/70 text-sm sm:text-base">
              Задайте вопрос и получите ответ в режиме онлайн
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-bg-card border border-border rounded-3xl overflow-hidden">
            {/* Chat messages */}
            <div className="h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-white/5 text-white/90"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <p className="text-[10px] mt-1 opacity-60">
                      {msg.timestamp.toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-white/40 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-4 sm:p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Напишите ваш вопрос..."
                  className="flex-1 bg-white/5 border border-border rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="px-6 py-3 bg-white text-black rounded-2xl text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

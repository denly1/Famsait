"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  userId: string;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [userId, setUserId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id = localStorage.getItem("support_user_id");
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("support_user_id", id);
    }
    setUserId(id);
    loadMessages(id);
    
    const interval = setInterval(() => loadMessages(id), 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async (uid: string) => {
    try {
      const res = await fetch(`/api/support/messages?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Ошибка загрузки сообщений:", err);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !userId) return;

    try {
      await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          text: inputValue,
          sender: "user",
        }),
      });

      setInputValue("");
      setTimeout(() => loadMessages(userId), 500);
    } catch (err) {
      console.error("Ошибка отправки:", err);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-black mb-8 text-center" style={{ fontFamily: "var(--font-heading)" }}>
          Поддержка
        </h1>

        {/* Чат */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
          
          <div className="p-6">
            <h2 className="text-xl font-bold mb-3 text-center" style={{ fontFamily: "var(--font-heading)" }}>Онлайн чат поддержки</h2>
            <p className="text-text-secondary mb-6 text-sm text-center">
              Напишите нам сообщение, и мы ответим в ближайшее время
            </p>

            {/* Сообщения */}
            <div className="bg-bg-dark rounded-xl p-4 h-[500px] overflow-y-auto mb-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-text-muted text-sm py-8">
                  Начните диалог, напишите первое сообщение
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-xl text-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-white"
                          : "bg-bg-card border border-border text-text-primary"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Ввод */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Введите сообщение..."
                className="flex-1 px-4 py-3 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none focus:border-primary/30 transition-colors"
              />
              <button
                onClick={handleSend}
                className="px-6 py-3 btn-gradient rounded-xl text-sm font-semibold"
              >
                <span className="relative z-10">Отправить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let id = localStorage.getItem("support_user_id");
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("support_user_id", id);
    }
    setUserId(id);
    loadMessages(id);
    const interval = setInterval(() => loadMessages(id!), 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async (uid: string) => {
    try {
      const res = await fetch(`/api/support/messages?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {}
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !userId) return;
    const text = inputValue.trim();
    setInputValue("");
    setMessages(prev => [...prev, { id: `tmp-${Date.now()}`, text, sender: "user", timestamp: new Date(), userId }]);
    setIsTyping(true);
    try {
      await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text, sender: "user" }),
      });
      setTimeout(() => { loadMessages(userId); setIsTyping(false); }, 600);
    } catch { setIsTyping(false); }
  };

  const fmt = (ts: Date) => new Date(ts).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="pt-44 sm:pt-56 pb-16 sm:pb-20 relative min-h-screen">
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 -right-40 opacity-20" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-10">
          <span className="tag tag-primary mb-3 sm:mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            ПОДДЕРЖКА
          </span>
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            ЧАТ ПОДДЕРЖКИ
          </h1>
          <p className="text-text-secondary mt-3 sm:mt-4 text-[14px] sm:text-[15px] leading-relaxed">
            Напишите нам — ответим в ближайшее время
          </p>
        </div>

        {/* Chat container */}
        <div className="rounded-2xl overflow-hidden border border-border shadow-2xl shadow-black/30">
          {/* Header */}
          <div className="relative p-5" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <img src="/Familylogo.png" alt="F" className="w-12 h-12 rounded-xl object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-purple-700" />
              </div>
              <div>
                <p className="font-bold text-white text-base" style={{ fontFamily: "var(--font-heading)" }}>THE FAMILY</p>
                <p className="text-white/70 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  Онлайн · отвечаем быстро
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[450px] sm:h-[500px] overflow-y-auto p-5 space-y-3" style={{ background: "#0d0d12" }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div>
                  <p className="text-white/70 font-semibold text-base">Начните диалог</p>
                  <p className="text-white/35 text-sm mt-1">Напишите ваш вопрос — мы на связи</p>
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.sender === "support" && (
                  <img src="/Familylogo.png" className="w-8 h-8 rounded-lg object-cover flex-shrink-0 self-end" alt="" />
                )}
                <div className={`flex flex-col gap-0.5 max-w-[75%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                      msg.sender === "user"
                        ? "rounded-br-md text-white"
                        : "rounded-bl-md text-white/90 border border-white/10"
                    }`}
                    style={msg.sender === "user"
                      ? { background: "linear-gradient(135deg, #7c3aed, #ec4899)" }
                      : { background: "rgba(255,255,255,0.06)" }
                    }
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-white/25 px-1">{fmt(msg.timestamp)}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5">
                <img src="/Familylogo.png" className="w-8 h-8 rounded-lg object-cover flex-shrink-0 self-end" alt="" />
                <div className="px-4 py-3 rounded-2xl rounded-bl-md border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="flex gap-1 items-center">
                    {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/8" style={{ background: "#131318" }}>
            <div className="flex gap-3 items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Введите сообщение..."
                className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors border"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-white transition-all disabled:opacity-30 hover:opacity-90 active:scale-95"
                style={{ background: inputValue.trim() ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "rgba(255,255,255,0.06)" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

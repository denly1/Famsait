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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

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
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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
    <div className="pt-20 sm:pt-28 pb-8 px-4 sm:px-6 relative">
      <div className="glow-orb glow-orb-purple w-[400px] h-[400px] -top-40 -right-40 opacity-15 pointer-events-none" />

      <div className="max-w-lg mx-auto relative z-10">
        {/* Заголовок */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            ЧАТ ПОДДЕРЖКИ
          </h1>
          <p className="text-white/50 mt-1 text-xs">Напишите нам — ответим в ближайшее время</p>
        </div>

        {/* Чат-карточка с фиксированной высотой */}
        <div
          className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 flex flex-col"
          style={{ height: "70svh", maxHeight: 600, minHeight: 400 }}
        >
          {/* Chat header */}
          <div className="flex-shrink-0 px-4 py-3" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <img src="/Familylogo.png" alt="F" className="w-9 h-9 rounded-xl object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-purple-700" />
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "var(--font-heading)" }}>FAMILY</p>
                <p className="text-white/70 text-xs">Онлайн · отвечаем быстро</p>
              </div>
            </div>
          </div>

          {/* Сообщения */}
          <div
            ref={chatBodyRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ background: "#0d0d12", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div>
                  <p className="text-white/70 font-semibold text-sm">Начните диалог</p>
                  <p className="text-white/35 text-xs mt-0.5">Напишите ваш вопрос — мы на связи</p>
                </div>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.sender === "support" && (
                  <img src="/Familylogo.png" className="w-7 h-7 rounded-lg object-cover flex-shrink-0 self-end" alt="" />
                )}
                <div className={`flex flex-col gap-0.5 max-w-[80%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                      msg.sender === "user" ? "rounded-br-sm text-white" : "rounded-bl-sm text-white/90 border border-white/10"
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
              <div className="flex gap-2">
                <img src="/Familylogo.png" className="w-7 h-7 rounded-lg object-cover flex-shrink-0 self-end" alt="" />
                <div className="px-3 py-2 rounded-2xl rounded-bl-sm border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="flex gap-1 items-center h-4">
                    {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-3 py-3 border-t border-white/10" style={{ background: "#131318" }}>
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Введите сообщение..."
                className="flex-1 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none border"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", fontSize: "16px", touchAction: "manipulation" }}
                autoComplete="off"
                autoCorrect="off"
                inputMode="text"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-white transition-all disabled:opacity-30 active:scale-95"
                style={{ background: inputValue.trim() ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "rgba(255,255,255,0.08)", touchAction: "manipulation" }}
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

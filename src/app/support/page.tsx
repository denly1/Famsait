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
    <div className="pt-32 sm:pt-40 pb-16 sm:pb-20 relative min-h-screen">
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
            Напишите нам — ответим в ближайшее время. Также можете написать в{" "}
            <a href="https://t.me/familymsk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Telegram</a>
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

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="https://t.me/familymsk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </div>
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Telegram</div>
              <div className="text-text-muted text-xs">@familymsk</div>
            </div>
          </a>
          <a href="https://vk.ru/thefamilymskk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.85 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.624 2.168-3.624.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
            </div>
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>ВКонтакте</div>
              <div className="text-text-muted text-xs">thefamilymskk</div>
            </div>
          </a>
          <a href="mailto:tusa2026@mail.ru" className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Email</div>
              <div className="text-text-muted text-xs">tusa2026@mail.ru</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

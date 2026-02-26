"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  userId: string;
  isRead?: boolean;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
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
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async (uid: string) => {
    try {
      const res = await fetch(`/api/support/messages?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        const newMsgs: Message[] = data.messages || [];
        setMessages(prev => {
          const hasNewFromSupport = newMsgs.some(
            m => m.sender === "support" && !prev.find(p => p.id === m.id)
          );
          if (hasNewFromSupport && !isOpen) setHasUnread(true);
          return newMsgs;
        });
      }
    } catch {}
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !userId) return;
    const text = inputValue.trim();
    setInputValue("");
    setMessages(prev => [...prev, {
      id: `tmp-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
      userId,
    }]);
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

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => loadMessages(userId), 10000);
    return () => clearInterval(interval);
  }, [userId, isOpen]);

  const fmt = (ts: Date) => new Date(ts).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setIsOpen(o => !o); setHasUnread(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 select-none"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}
        aria-label="Поддержка"
      >
        <div className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}>
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          )}
        </div>
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-bg-dark" />
        {hasUnread && (
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-rose-500 rounded-full text-[10px] font-bold flex items-center justify-center">!</span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden" onClick={() => setIsOpen(false)} />}

      {/* Chat window */}
      <div className={`fixed z-50 transition-all duration-300 ease-out ${
        isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
      } bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-[420px]`}>
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60" style={{ background: "#0d0d12" }}>

          {/* Header */}
          <div className="relative p-4" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <img src="/Familylogo.png" alt="F" className="w-10 h-10 rounded-xl object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-purple-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "var(--font-heading)" }}>FAMILY</p>
                <p className="text-white/70 text-xs">Поддержка · онлайн</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="h-72 sm:h-80 overflow-y-auto p-4 space-y-3" style={{ background: "#0d0d12" }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div>
                  <p className="text-white/70 font-semibold text-sm">Онлайн чат поддержки</p>
                  <p className="text-white/35 text-xs mt-1">Напишите нам сообщение,<br/>и мы ответим в ближайшее время</p>
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.sender === "support" && (
                  <img src="/Familylogo.png" className="w-7 h-7 rounded-lg object-cover flex-shrink-0 self-end" alt="" />
                )}
                <div className={`flex flex-col gap-0.5 max-w-[78%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
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
              <div className="flex gap-2">
                <img src="/Familylogo.png" className="w-7 h-7 rounded-lg object-cover flex-shrink-0 self-end" alt="" />
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
          <div className="p-3 border-t border-white/8" style={{ background: "#131318" }}>
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Введите сообщение..."
                className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors border"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white transition-all disabled:opacity-30 hover:opacity-90 active:scale-95"
                style={{ background: inputValue.trim() ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "rgba(255,255,255,0.06)" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

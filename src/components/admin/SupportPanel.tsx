"use client";

import { useState, useEffect, useRef } from "react";

interface SupportMessage {
  id: string;
  userId: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  userId: string;
  messageCount: number;
  lastMessageAt: string;
  unreadCount: number;
  lastMessage: string;
}

export default function SupportPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
      const interval = setInterval(() => loadMessages(selectedUserId), 10000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const res = await fetch("/api/admin/support");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/support/messages?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedUserId || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          text: replyText,
          sender: "support",
        }),
      });

      if (res.ok) {
        setReplyText("");
        await loadMessages(selectedUserId);
        await loadConversations();
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Conversations list */}
      <div className="lg:col-span-1 bg-bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
            Диалоги ({conversations.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">
              Нет активных диалогов
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => setSelectedUserId(conv.userId)}
                className={`w-full p-4 border-b border-border text-left hover:bg-white/5 transition-colors ${
                  selectedUserId === conv.userId ? "bg-white/10" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {conv.userId.split("-")[0]}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-1 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <span className="text-xs text-text-muted flex-shrink-0">
                    {new Date(conv.lastMessageAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat window */}
      <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
        {selectedUserId ? (
          <>
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                Диалог с {selectedUserId.split("-")[0]}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "support" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      msg.sender === "support"
                        ? "bg-gradient-to-br from-primary to-accent text-white"
                        : "bg-white/5 text-white/90 border border-white/10"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <p className="text-[10px] mt-1 opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendReply()}
                  placeholder="Введите ответ..."
                  className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                  disabled={loading}
                />
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim() || loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
            Выберите диалог для просмотра
          </div>
        )}
      </div>
    </div>
  );
}

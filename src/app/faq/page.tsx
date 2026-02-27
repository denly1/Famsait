"use client";

import { useState, useEffect } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    fetch("/api/faq").then(r => r.json()).then(d => setFaqItems(d.faq || [])).catch(() => {});
  }, []);

  return (
    <div className="pt-44 sm:pt-56 pb-16 sm:pb-20 relative">
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 -right-40 opacity-20" />

      <div className="max-w-md mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-10 sm:mb-14 text-center">
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Q&amp;A
          </h1>
          <p className="text-white/60 mt-3 sm:mt-4 max-w-sm mx-auto text-sm leading-relaxed">
            Ответы на самые частые вопросы
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.id} className="overflow-hidden rounded-2xl transition-all duration-300">
                {/* Кнопка вопроса */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: isOpen ? "rgba(255,255,255,0.12)" : "#fff",
                    borderRadius: isOpen ? "16px 16px 0 0" : "16px",
                  }}
                >
                  <span
                    className="font-bold text-base sm:text-lg tracking-wide leading-snug"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: isOpen ? "#fff" : "#000",
                    }}
                  >
                    {item.question}
                  </span>
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isOpen ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
                    }}
                  >
                    <svg
                      className="w-4 h-4 transition-transform duration-300"
                      style={{
                        color: isOpen ? "#fff" : "#000",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>

                {/* Ответ */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
                >
                  <div
                    className="px-6 py-4"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: "0 0 16px 16px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderTop: "none",
                    }}
                  >
                    <p className="text-white/80 text-sm sm:text-[15px] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {faqItems.length > 0 && (
            <div className="h-px my-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
          )}

          {/* CTA */}
          <a
            href="/support"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/30 text-white font-bold text-base sm:text-lg tracking-wide transition-all hover:bg-white/5 hover:border-white/50 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            НЕ НАШЁЛ ОТВЕТ? НАПИШИ НАМ
          </a>
        </div>
      </div>
    </div>
  );
}
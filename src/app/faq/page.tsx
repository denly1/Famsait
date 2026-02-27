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
              <div key={item.id}>
                {/* Кнопка вопроса — как кнопки в контактах */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full flex items-center justify-between gap-3 px-6 py-4 rounded-2xl font-bold text-base sm:text-lg tracking-wide transition-all active:scale-[0.98] text-left ${
                    isOpen
                      ? "bg-white text-black"
                      : "border border-white/30 text-white hover:bg-white/5 hover:border-white/50"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <span className="flex-1">{item.question}</span>
                  <svg
                    className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                {/* Ответ — выезжает снизу */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-6 pt-3 pb-2">
                    <p className="text-white/60 text-sm sm:text-[15px] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Разделитель */}
          {faqItems.length > 0 && (
            <div className="h-px my-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
          )}

          {/* CTA — как в контактах */}
          <a
            href="/support"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/30 text-white font-bold text-base sm:text-lg tracking-wide transition-all hover:bg-white/5 hover:border-white/50 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            НЕ НАШЁЛ ОТВЕТ? НАПИШИ НАМ
          </a>
        </div>
      </div>
    </div>
  );
}
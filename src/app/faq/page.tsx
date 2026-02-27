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
    <div className="relative overflow-hidden" style={{ background: "#07070d" }}>
      {/* Декоративные орбы */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 -right-32 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 pt-36 sm:pt-48 pb-20 sm:pb-32">
        {/* Заголовок секции */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 mb-6" style={{ background: "rgba(124,58,237,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">Частые вопросы</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Q<span style={{ WebkitTextStroke: "2px rgba(124,58,237,0.8)", color: "transparent" }}>&amp;</span>A
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-xl">
            Ответы на самые частые вопросы. Не нашёл ответ?{" "}
            <a href="/support" className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/30">Напиши нам</a>
          </p>
        </div>

        {/* FAQ список */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-3xl transition-all duration-500 cursor-pointer"
                  style={{
                    background: isOpen
                      ? "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(236,72,153,0.06) 100%)"
                      : "rgba(255,255,255,0.03)",
                    border: isOpen ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isOpen ? "0 0 40px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
                  }}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {/* Верхняя светящаяся линия при открытии */}
                  {isOpen && (
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #ec4899, transparent)" }} />
                  )}

                  <div className="p-5 sm:p-7">
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* Большой Q маркер */}
                      <div
                        className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black transition-all duration-300"
                        style={{
                          background: isOpen
                            ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                            : "rgba(255,255,255,0.05)",
                          color: isOpen ? "#fff" : "rgba(255,255,255,0.3)",
                          fontFamily: "var(--font-heading)",
                          boxShadow: isOpen ? "0 8px 20px rgba(124,58,237,0.4)" : "none",
                        }}
                      >
                        Q
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            className="text-base sm:text-lg font-bold leading-snug transition-colors duration-300"
                            style={{
                              fontFamily: "var(--font-heading)",
                              color: isOpen ? "#fff" : "rgba(255,255,255,0.75)",
                            }}
                          >
                            {item.question}
                          </h3>

                          {/* Кнопка +/- */}
                          <div
                            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 mt-0.5"
                            style={{
                              background: isOpen ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                            }}
                          >
                            <svg
                              className="w-4 h-4 transition-all duration-300"
                              style={{
                                color: isOpen ? "#a78bfa" : "rgba(255,255,255,0.3)",
                                transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                              }}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>

                        {/* Ответ */}
                        <div
                          className="overflow-hidden transition-all duration-500"
                          style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
                        >
                          <div className="pt-4">
                            {/* Разделитель */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", fontFamily: "var(--font-heading)", color: "#fff" }}>A</div>
                              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.5), transparent)" }} />
                            </div>
                            <p className="text-white/60 text-sm sm:text-base leading-relaxed" style={{ paddingLeft: "36px" }}>
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA блок */}
          <div className="mt-16 sm:mt-20 relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.05))", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, #7c3aed 40%, #ec4899 60%, transparent)" }} />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #7c3aed, transparent)", filter: "blur(40px)" }} />

            <div className="relative z-10 p-8 sm:p-12 text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl sm:text-3xl font-black mb-3 text-white" style={{ fontFamily: "var(--font-heading)" }}>Не нашёл ответ?</h3>
              <p className="text-white/50 text-sm sm:text-base mb-8 max-w-md mx-auto">
                Напиши нам напрямую — отвечаем быстро и по делу
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <a href="mailto:tusa2026@mail.ru" className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold tracking-wide text-white text-center transition-all hover:opacity-90 active:scale-95" style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
                  НАПИСАТЬ НА ПОЧТУ
                </a>
                <a href="/support" className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold tracking-wide text-white text-center border transition-all hover:bg-white/5 active:scale-95" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                  ЧАТ ПОДДЕРЖКИ →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
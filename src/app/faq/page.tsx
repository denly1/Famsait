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
      <div className="glow-orb glow-orb-purple w-[400px] h-[400px] -top-40 right-0 opacity-20" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-14">
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Q&A
          </h1>
          <p className="text-text-secondary mt-3 sm:mt-4 text-[14px] sm:text-[15px] leading-relaxed">
            Ответы на самые частые вопросы. Не нашёл ответ? Напиши нам!
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`group rounded-2xl overflow-hidden border transition-all duration-300 ${
                openIndex === index
                  ? "border-primary/40 shadow-lg shadow-primary/5"
                  : "border-white/8 hover:border-white/20"
              }`}
              style={{ background: openIndex === index ? "rgba(124,58,237,0.05)" : "rgba(255,255,255,0.02)" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 text-left transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  {/* Иконка вопроса */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIndex === index
                      ? "bg-gradient-to-br from-primary to-accent"
                      : "bg-white/5 group-hover:bg-white/10"
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className={`font-semibold text-[15px] sm:text-base leading-snug transition-colors duration-200 ${
                    openIndex === index ? "text-white" : "text-white/80 group-hover:text-white"
                  }`} style={{ fontFamily: "var(--font-heading)" }}>
                    {item.question}
                  </span>
                </div>
                {/* Стрелка */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === index ? "bg-primary/20 rotate-180" : "bg-white/5"
                }`}>
                  <svg className={`w-3.5 h-3.5 transition-colors duration-300 ${openIndex === index ? "text-primary" : "text-white/40"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Ответ */}
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="px-5 sm:px-6 pb-5">
                  {/* Разделитель с градиентом */}
                  <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.4), rgba(236,72,153,0.2), transparent)" }} />
                  <p className="text-white/60 text-sm sm:text-[15px] leading-relaxed pl-11">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-bg-card" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="relative z-10 p-6 sm:p-8 text-center">
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Не нашёл ответ?</h3>
            <p className="text-text-secondary text-sm mb-6">
              Напиши нам на почту или в чат поддержки — ответим быстро!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:tusa2026@mail.ru"
                className="w-full sm:w-auto px-6 py-3 btn-gradient rounded-xl text-sm font-semibold tracking-wide text-center"
              >
                <span className="relative z-10">НАПИСАТЬ НА ПОЧТУ</span>
              </a>
              <a
                href="/support"
                className="w-full sm:w-auto px-6 py-3 btn-outline rounded-xl text-sm font-semibold tracking-wide text-center"
              >
                ЧАТ ПОДДЕРЖКИ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
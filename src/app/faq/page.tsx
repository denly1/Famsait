"use client";

import { faqItems } from "@/lib/data";
import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pt-20 sm:pt-32 pb-16 sm:pb-20 relative">
      <div className="glow-orb glow-orb-purple w-[400px] h-[400px] -top-40 right-0 opacity-20" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-14">
          <span className="tag tag-primary mb-3 sm:mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            ПОДДЕРЖКА
          </span>
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Q&A
          </h1>
          <p className="text-text-secondary mt-3 sm:mt-4 text-[14px] sm:text-[15px] leading-relaxed">
            Ответы на самые частые вопросы. Не нашёл ответ? Напиши нам!
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-bg-card border border-border hover:border-border-light overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-4 pr-4">
                  <span className="mono-label text-text-muted/40 text-xs flex-shrink-0">0{index + 1}</span>
                  <span className="font-semibold text-[15px] sm:text-base" style={{ fontFamily: "var(--font-heading)" }}>{item.question}</span>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === index ? "bg-primary/10 rotate-180" : "bg-white/[0.03]"
                }`}>
                  <svg
                    className={`w-4 h-4 transition-colors duration-300 ${openIndex === index ? "text-primary" : "text-text-muted"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 sm:px-6 pb-5 sm:pb-6 pl-[48px] sm:pl-[64px]">
                  <div className="h-[1px] bg-gradient-to-r from-border via-border-light to-border mb-4" />
                  <p className="text-text-secondary text-[14px] leading-relaxed">
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
              Напиши нам в Telegram или на почту — ответим в течение часа!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://t.me/familymsk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 btn-gradient rounded-xl text-sm font-semibold tracking-wide text-center"
              >
                <span className="relative z-10">НАПИСАТЬ В TELEGRAM</span>
              </a>
              <a
                href="mailto:tusa2026@mail.ru"
                className="w-full sm:w-auto px-6 py-3 btn-outline rounded-xl text-sm font-semibold tracking-wide text-center"
              >
                НАПИСАТЬ НА ПОЧТУ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const promos = [
  {
    code: "FAMILY",
    discount: "Скидка 10%",
    description: "На все события этого месяца",
    color: "#8B5CF6",
    icon: "🎉",
  },
  {
    code: "FIRSTTIME",
    discount: "Скидка 15%",
    description: "Для новых гостей",
    color: "#EC4899",
    icon: "✨",
  },
  {
    code: "VIP2026",
    discount: "VIP доступ",
    description: "Приоритетный вход + бонусы",
    color: "#F59E0B",
    icon: "👑",
  },
];

export default function PromoSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-bg-dark to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="tag tag-primary mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ
          </span>
          <h2 
            className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 gradient-text-animated"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ПРОМОКОДЫ
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
            Используй промокоды при покупке билетов и получи скидку или VIP-доступ
          </p>
        </div>

        {/* Promo cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo, index) => (
            <div
              key={promo.code}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="relative rounded-3xl overflow-hidden p-8 transition-all duration-500 hover:scale-105 card-3d"
                style={{ 
                  background: `linear-gradient(135deg, ${promo.color}15 0%, ${promo.color}05 100%)`,
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: `${promo.color}30`,
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                  {promo.icon}
                </div>

                {/* Discount */}
                <div 
                  className="text-2xl sm:text-3xl font-black mb-2"
                  style={{ 
                    fontFamily: "var(--font-heading)",
                    color: promo.color,
                  }}
                >
                  {promo.discount}
                </div>

                {/* Description */}
                <p className="text-text-secondary text-sm mb-6">
                  {promo.description}
                </p>

                {/* Promo code */}
                <div className="relative">
                  <button
                    onClick={() => copyToClipboard(promo.code)}
                    className="w-full px-6 py-4 rounded-2xl font-mono font-bold text-lg transition-all duration-300 relative overflow-hidden group/btn"
                    style={{
                      backgroundColor: `${promo.color}20`,
                      border: `2px dashed ${promo.color}`,
                      color: promo.color,
                    }}
                  >
                    {/* Hover background */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: promo.color }}
                    />
                    
                    {/* Text */}
                    <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">
                      {copiedCode === promo.code ? "✓ СКОПИРОВАНО!" : promo.code}
                    </span>
                  </button>
                </div>

                {/* Copy hint */}
                <p className="text-xs text-text-muted text-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Нажми, чтобы скопировать
                </p>
              </div>

              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"
                style={{ backgroundColor: promo.color }}
              />
            </div>
          ))}
        </div>

        {/* Info block */}
        <div className="mt-16 text-center">
          <div className="inline-block px-8 py-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Промокоды действуют при покупке билетов на сайте или в кассе</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

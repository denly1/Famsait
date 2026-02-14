"use client";

import { events } from "@/lib/data";
import Link from "next/link";
import { use, useState } from "react";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = events.find((e) => e.id === id);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<string | null>(null);

  if (!event) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Мероприятие не найдено</h1>
        <Link href="/events" className="text-primary mt-4 inline-block hover:underline text-sm">
          ← Назад к мероприятиям
        </Link>
      </div>
    );
  }

  const handlePromo = () => {
    if (promoCode.trim().toUpperCase() === "FAMILY2026") {
      setPromoResult("Промокод применён! Скидка 20%");
    } else if (promoCode.trim() === "") {
      setPromoResult("Введите промокод");
    } else {
      setPromoResult("Промокод не найден");
    }
  };

  return (
    <div className="pt-16 sm:pt-20 pb-16 sm:pb-20 relative">
      {/* Background glow */}
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 -right-40 opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back link */}
        <Link
          href={event.isPast ? "/past" : "/events"}
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-5 sm:mb-8 text-[13px] font-medium group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Назад
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14">
          {/* Image */}
          <div className="animate-fade-in-up">
            <div className="rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] relative card-glow border border-border">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 via-transparent to-transparent" />

              {/* Floating badges on image */}
              <div className="absolute top-5 left-5 flex gap-2">
                <span className="tag tag-primary backdrop-blur-md">{event.isPast ? "ПРОШЕДШЕЕ" : "СКОРО"}</span>
                <span className="tag tag-accent backdrop-blur-md">{event.ageLimit}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              {event.title}
            </h1>
            <p className="text-base sm:text-lg text-text-secondary font-medium mb-6 sm:mb-8">{event.subtitle}</p>

            {/* Date & Venue cards */}
            <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-card border border-border">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-[15px]" style={{ fontFamily: "var(--font-heading)" }}>{event.date}</div>
                  <div className="text-text-muted text-[13px]">{event.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-card border border-border">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-[15px]" style={{ fontFamily: "var(--font-heading)" }}>{event.venue}</div>
                  <div className="text-text-muted text-[13px]">{event.address}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-[14px] sm:text-[15px] leading-relaxed mb-6 sm:mb-8 whitespace-pre-line">{event.description}</p>

            {/* Lineup */}
            <div className="mb-6 sm:mb-8">
              <h3 className="mono-label mb-3">ЛАЙНАП</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {event.lineup.map((artist) => (
                  <span
                    key={artist}
                    className="px-4 py-2 rounded-xl bg-bg-card border border-border text-sm font-semibold hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {artist}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-6 sm:mb-8">
              <h3 className="mono-label mb-3">ФИШКИ</h3>
              <div className="flex flex-wrap gap-1.5">
                {event.features.map((feature) => (
                  <span key={feature} className="tag tag-accent">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Ticket Section */}
            {!event.isPast && (
              <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                {/* Top accent */}
                <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />

                <div className="p-6 space-y-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="mono-label text-[10px]">СТОИМОСТЬ</span>
                      <div className="text-3xl font-bold gradient-text mt-1" style={{ fontFamily: "var(--font-heading)" }}>
                        {event.price > 0 ? `${event.price}${event.currency}` : "КУПИТЬ БИЛЕТ"}
                      </div>
                    </div>
                    <span className="tag tag-primary">БИЛЕТЫ В ПРОДАЖЕ</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={event.ticketUrl}
                      target={event.ticketUrl?.startsWith("http") ? "_blank" : undefined}
                      rel={event.ticketUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 btn-gradient rounded-xl font-semibold text-[15px] tracking-wide w-full"
                    >
                      <span className="relative z-10">КУПИТЬ БИЛЕТ</span>
                      <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                    <button
                      onClick={() => setPromoOpen(!promoOpen)}
                      className="flex-1 px-6 py-4 btn-outline rounded-xl font-semibold text-[15px] tracking-wide w-full"
                    >
                      ПРОМОКОД
                    </button>
                  </div>

                  {promoOpen && (
                    <div className="animate-fade-in space-y-3 pt-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Введите промокод"
                          className="flex-1 px-4 py-3 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none transition-colors"
                          style={{ fontFamily: "var(--font-mono)" }}
                        />
                        <button
                          onClick={handlePromo}
                          className="px-5 py-3 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors border border-primary/20"
                        >
                          Применить
                        </button>
                      </div>
                      {promoResult && (
                        <p className={`text-sm font-medium ${promoResult.includes("применён") ? "text-emerald-400" : "text-accent"}`}>
                          {promoResult}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gallery for past events */}
            {event.isPast && event.gallery && (
              <div>
                <h3 className="mono-label mb-4">ФОТОГАЛЕРЕЯ</h3>
                <div className="grid grid-cols-2 gap-3">
                  {event.gallery.map((photo, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-square border border-border card-hover">
                      <img
                        src={photo}
                        alt={`${event.title} фото ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

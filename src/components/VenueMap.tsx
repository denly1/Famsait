"use client";

import { useState } from "react";

const venues = [
  { id: "arbat-hall", name: "ARBAT HALL", address: "Новый Арбат, 21", type: "Концертный зал", capacity: "1500+", coords: { x: 38, y: 35 } },
  { id: "izi", name: "IZI", address: "Басманный пер., 8, стр. 1", type: "Клуб", capacity: "800+", coords: { x: 55, y: 42 } },
  { id: "anima", name: "ANIMA", address: "Сущёвская ул., 21", type: "Клуб", capacity: "1000+", coords: { x: 45, y: 28 } },
  { id: "vibe", name: "VIBE", address: "Бутырская ул., 46, стр. 1", type: "Клуб", capacity: "800+", coords: { x: 42, y: 22 } },
  { id: "base", name: "BASE", address: "ул. Орджоникидзе, 11, стр. 1", type: "Клуб", capacity: "1200+", coords: { x: 45, y: 62 } },
  { id: "vk-stadium", name: "VK STADIUM", address: "Ленинградский пр-т, 80, корп. 17", type: "Стадион", capacity: "7000+", coords: { x: 35, y: 18 } },
  { id: "castle-hall", name: "CASTLE HALL", address: "м. Тушинская", type: "Концертный зал", capacity: "500+", coords: { x: 22, y: 15 } },
  { id: "pravda", name: "PRAVDA", address: "ул. Правды, 24, стр. 3", type: "Клуб", capacity: "700+", coords: { x: 40, y: 30 } },
  { id: "atmosphere", name: "ATMOSPHERE", address: "Шмитовский пр-д, 32А, стр. 1", type: "Концертный зал", capacity: "7000+", coords: { x: 28, y: 35 } },
];

export default function VenueMap() {
  const [active, setActive] = useState<string | null>(null);
  const activeVenue = venues.find((v) => v.id === active);

  return (
    <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="mono-label text-[10px]">ИНТЕРАКТИВНАЯ КАРТА</span>
            <h3 className="font-bold text-base mt-1" style={{ fontFamily: "var(--font-heading)" }}>Наши площадки</h3>
          </div>
          <span className="tag tag-primary">{venues.length} ЛОКАЦИЙ</span>
        </div>

        {/* Map area */}
        <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-xl bg-bg-dark border border-border overflow-hidden mb-4">
          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-40" />
          {/* Decorative roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 50 L100 50" stroke="rgba(139,92,246,0.06)" strokeWidth="0.3" />
            <path d="M50 0 L50 100" stroke="rgba(139,92,246,0.06)" strokeWidth="0.3" />
            <path d="M20 0 L80 100" stroke="rgba(139,92,246,0.04)" strokeWidth="0.2" />
            <path d="M80 0 L20 100" stroke="rgba(139,92,246,0.04)" strokeWidth="0.2" />
            {/* Moscow river curve */}
            <path d="M0 60 Q30 45 50 55 T100 50" stroke="rgba(59,130,246,0.1)" strokeWidth="0.8" fill="none" />
          </svg>

          {/* Center label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted/10 text-[10px] font-bold tracking-[0.3em]" style={{ fontFamily: "var(--font-mono)" }}>
            МОСКВА
          </div>

          {/* Venue pins */}
          {venues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => setActive(active === venue.id ? null : venue.id)}
              className={`absolute group transition-all duration-300 -translate-x-1/2 -translate-y-1/2 ${
                active === venue.id ? "z-20 scale-125" : "z-10 hover:scale-110"
              }`}
              style={{ left: `${venue.coords.x}%`, top: `${venue.coords.y}%` }}
            >
              {/* Pulse ring */}
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                active === venue.id ? "animate-ping bg-primary/30 scale-150" : ""
              }`} />
              {/* Pin */}
              <div className={`relative w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 transition-all ${
                active === venue.id
                  ? "bg-primary border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                  : "bg-bg-card border-primary/40 group-hover:border-primary group-hover:bg-primary/20"
              }`} />
              {/* Label */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[9px] font-bold tracking-wider transition-all ${
                active === venue.id ? "text-primary opacity-100" : "text-text-muted/50 opacity-0 group-hover:opacity-100"
              }`} style={{ fontFamily: "var(--font-mono)" }}>
                {venue.name}
              </div>
            </button>
          ))}
        </div>

        {/* Venue details */}
        {activeVenue ? (
          <div className="animate-fade-in p-4 rounded-xl bg-primary/[0.04] border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{activeVenue.name}</h4>
              <span className="tag tag-primary text-[9px]">{activeVenue.type}</span>
            </div>
            <p className="text-text-muted text-xs mb-2">{activeVenue.address}</p>
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {activeVenue.capacity}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 text-text-muted/40 text-xs">
            Нажмите на точку, чтобы увидеть информацию о площадке
          </div>
        )}

        {/* Venue list */}
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {venues.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(active === v.id ? null : v.id)}
              className={`text-left p-3 rounded-lg text-xs transition-all ${
                active === v.id ? "bg-primary/8 border border-primary/15" : "bg-bg-dark/50 border border-transparent hover:border-border"
              }`}
            >
              <div className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>{v.name}</div>
              <div className="text-text-muted/60 text-[10px] mt-0.5">{v.type}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

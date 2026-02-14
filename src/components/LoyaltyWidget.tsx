"use client";

import { useState } from "react";

const LEVELS = [
  { name: "NEWCOMER", minPoints: 0, color: "text-text-secondary", bg: "bg-white/[0.05]", perks: ["Доступ к мероприятиям"] },
  { name: "REGULAR", minPoints: 100, color: "text-primary-light", bg: "bg-primary/10", perks: ["Скидка 5%", "Ранний доступ к билетам"] },
  { name: "VIP", minPoints: 300, color: "text-accent", bg: "bg-accent/10", perks: ["Скидка 15%", "VIP-зона", "Бесплатный мерч"] },
  { name: "LEGEND", minPoints: 700, color: "text-amber-400", bg: "bg-amber-500/10", perks: ["Скидка 25%", "Backstage", "Персональный менеджер", "+1 бесплатно"] },
];

export default function LoyaltyWidget() {
  const [registered, setRegistered] = useState(false);
  const [phone, setPhone] = useState("");
  const [points] = useState(0);

  const currentLevel = LEVELS.reduce((acc, lvl) => (points >= lvl.minPoints ? lvl : acc), LEVELS[0]);
  const nextLevel = LEVELS.find((l) => l.minPoints > points);
  const progressToNext = nextLevel
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  if (!registered) {
    return (
      <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-amber-500 via-primary to-accent" />
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-primary/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="font-bold text-base mb-1" style={{ fontFamily: "var(--font-heading)" }}>FAMILY LOYALTY</h3>
          <p className="text-text-muted text-sm mb-5">Копи баллы, получай скидки и VIP-привилегии</p>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className="flex-1 px-4 py-2.5 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none transition-colors"
            />
            <button
              onClick={() => phone.length >= 5 && setRegistered(true)}
              className="px-5 py-2.5 btn-gradient rounded-xl text-sm font-semibold flex-shrink-0"
            >
              <span className="relative z-10">ВОЙТИ</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-amber-500 via-primary to-accent" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="mono-label text-[10px]">УРОВЕНЬ</span>
            <div className={`font-bold text-lg ${currentLevel.color}`} style={{ fontFamily: "var(--font-heading)" }}>
              {currentLevel.name}
            </div>
          </div>
          <div className="text-right">
            <span className="mono-label text-[10px]">БАЛЛЫ</span>
            <div className="font-bold text-lg gradient-text" style={{ fontFamily: "var(--font-heading)" }}>{points}</div>
          </div>
        </div>

        {/* Progress bar */}
        {nextLevel && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>{currentLevel.name}</span>
              <span>{nextLevel.name} — {nextLevel.minPoints} pts</span>
            </div>
            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}

        {/* Perks */}
        <div className="space-y-1.5">
          <span className="mono-label text-[10px]">ПРИВИЛЕГИИ</span>
          {currentLevel.perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2 text-sm text-text-secondary">
              <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {perk}
            </div>
          ))}
        </div>

        {/* All levels */}
        <div className="mt-5 pt-4 border-t border-border">
          <span className="mono-label text-[10px] mb-2 block">ВСЕ УРОВНИ</span>
          <div className="flex gap-2">
            {LEVELS.map((lvl) => (
              <div
                key={lvl.name}
                className={`flex-1 text-center p-2 rounded-lg text-[10px] font-bold ${
                  lvl.name === currentLevel.name ? `${lvl.bg} ${lvl.color} border border-current/20` : "bg-white/[0.02] text-text-muted/40"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lvl.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

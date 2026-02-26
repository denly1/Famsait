"use client";

import { useState, useEffect } from "react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState({
    email: "tusa2026@mail.ru",
    telegram: "@familymsk",
    telegramUrl: "https://t.me/familymsk",
    vk: "thefamilymskk",
    vkUrl: "https://vk.ru/thefamilymskk",
    instagram: "@thefamily_msk",
    instagramUrl: "https://www.instagram.com/thefamily_msk",
    city: "Москва, Россия",
  });

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => {
      const s = data.settings;
      if (!s) return;
      setContacts(prev => ({
        ...prev,
        email: s.email || prev.email,
        telegramUrl: s.telegram_url || prev.telegramUrl,
        vkUrl: s.vk_url || prev.vkUrl,
        instagramUrl: s.instagram_url || prev.instagramUrl,
        city: s.address || prev.city,
      }));
    }).catch(() => {});
  }, []);

  return (
    <div className="pt-44 sm:pt-56 pb-16 sm:pb-20 relative">
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 -right-40 opacity-20" />

      <div className="max-w-md mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-10 sm:mb-14 text-center">
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            КОНТАКТЫ
          </h1>
          <p className="text-white/60 mt-3 sm:mt-4 max-w-sm mx-auto text-sm leading-relaxed">
            Мы всегда на связи
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Telegram — white filled */}
          <a
            href={contacts.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-black font-bold text-base sm:text-lg tracking-wide transition-all hover:bg-white/90 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            TELEGRAM
          </a>

          {/* VK — outlined */}
          <a
            href={contacts.vkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/30 text-white font-bold text-base sm:text-lg tracking-wide transition-all hover:bg-white/5 hover:border-white/50 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.85 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.624 2.168-3.624.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
            ВКОНТАКТЕ
          </a>

          {/* Instagram — outlined */}
          <a
            href={contacts.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/30 text-white font-bold text-base sm:text-lg tracking-wide transition-all hover:bg-white/5 hover:border-white/50 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            INSTAGRAM
          </a>

          {/* Email — outlined */}
          <a
            href={`mailto:${contacts.email}`}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/30 text-white font-bold text-base sm:text-lg tracking-wide transition-all hover:bg-white/5 hover:border-white/50 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            {contacts.email.toUpperCase()}
          </a>

          {/* City */}
          <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/10 text-white/50 text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {contacts.city}
          </div>
        </div>
      </div>
    </div>
  );
}
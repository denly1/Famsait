"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/events", label: "МЕРОПРИЯТИЯ" },
    { href: "/past", label: "ПРОШЕДШИЕ" },
    { href: "/faq", label: "Q&A" },
    { href: "/contacts", label: "КОНТАКТЫ" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      {/* Top accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src="/Familylogo.png" alt="THE FAMILY" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]" />
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                THE FAMILY
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-text-muted leading-none mt-0.5">
                MOSCOW
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-[13px] font-medium tracking-[0.05em] text-text-secondary hover:text-text-primary transition-all duration-300 rounded-lg hover:bg-white/[0.03] group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-5" />
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 btn-gradient rounded-lg text-[13px] font-semibold tracking-wide"
            >
              <span className="relative z-10">БИЛЕТЫ</span>
              <svg className="w-3.5 h-3.5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Mobile burger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/[0.05] transition-colors"
              aria-label="Меню"
            >
              <div className="flex flex-col gap-[5px]">
                <span
                  className={`w-5 h-[1.5px] bg-text-primary rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""
                  }`}
                />
                <span
                  className={`w-3.5 h-[1.5px] bg-text-primary rounded-full transition-all duration-300 ${
                    isMenuOpen ? "opacity-0 translate-x-2" : ""
                  }`}
                />
                <span
                  className={`w-5 h-[1.5px] bg-text-primary rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — Full screen overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-bg-dark/95 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)} />

        <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-2 px-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold tracking-tight text-text-secondary hover:text-text-primary transition-all duration-300 py-3 ${
                isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ fontFamily: "var(--font-heading)", transitionDelay: `${0.1 + i * 0.05}s` }}
            >
              {link.label}
            </Link>
          ))}
          <div className={`mt-6 w-full max-w-xs transition-all duration-300 ${
            isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`} style={{ transitionDelay: "0.35s" }}>
            <Link
              href="/events"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-6 py-4 btn-gradient rounded-2xl text-[15px] font-bold tracking-wide"
            >
              <span className="relative z-10">КУПИТЬ БИЛЕТЫ</span>
              <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Social links in mobile menu */}
          <div className={`flex items-center gap-4 mt-8 transition-all duration-300 ${
            isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`} style={{ transitionDelay: "0.4s" }}>
            <a href="https://t.me/familymsk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.05] border border-border flex items-center justify-center">
              <svg className="w-[18px] h-[18px] text-text-muted" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="https://vk.ru/thefamilymskk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.05] border border-border flex items-center justify-center">
              <svg className="w-[18px] h-[18px] text-text-muted" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.85 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.624 2.168-3.624.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
            </a>
            <a href="https://www.instagram.com/thefamily_msk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.05] border border-border flex items-center justify-center">
              <svg className="w-[18px] h-[18px] text-text-muted" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { events } from "@/lib/data";
import EventCard from "@/components/EventCard";
import CountdownTimer from "@/components/CountdownTimer";
import VenueMap from "@/components/VenueMap";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomePage() {
  const upcomingEvents = events.filter((e) => !e.isPast).slice(0, 4);
  const pastEvents = events.filter((e) => e.isPast).slice(0, 3);
  const nextEvent = upcomingEvents[0];

  return (
    <>
      {/* ===== HERO — FULL SCREEN IMMERSIVE ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-bg-dark" />

        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-900/30 via-transparent to-rose-900/20 gradient-flow" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-[120px] hero-glow-bg" />

        {/* Floating particles */}
        <div className="absolute w-2 h-2 rounded-full bg-primary/40 top-[20%] left-[15%] animate-float" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-accent/30 top-[60%] right-[20%] animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute w-1 h-1 rounded-full bg-primary/50 top-[40%] left-[70%] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-accent/20 bottom-[30%] left-[25%] animate-float" style={{ animationDelay: "2s" }} />

        {/* Logo watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
          <img src="/Familylogo.png" alt="" className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 sm:pt-28 pb-12 sm:pb-16">
          {/* Live badge */}
          <div className="animate-fade-in-up mb-8">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] sm:text-[12px] font-semibold tracking-wide text-emerald-300/90 truncate max-w-[260px] sm:max-w-none">
                БЛИЖАЙШЕЕ — {nextEvent?.title} · {nextEvent?.date}
              </span>
            </div>
          </div>

          {/* Main heading */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <img src="/Familylogo.png" alt="THE FAMILY" className="w-16 h-16 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary/20" />
          </div>

          <h1 className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <span className="block text-4xl sm:text-7xl md:text-8xl lg:text-[8rem] font-black tracking-[-0.04em] leading-[0.85]" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="text-text-primary">THE</span>
              <br />
              <span className="gradient-text">FAMILY</span>
            </span>
          </h1>

          <div className="animate-fade-in-up mt-4 sm:mt-6" style={{ animationDelay: "0.25s" }}>
            <p className="text-sm sm:text-lg text-text-secondary max-w-md mx-auto leading-relaxed px-4 sm:px-0">
              Организуем тусовки, которые ты запомнишь навсегда.
              Москва. Лучшие площадки. Невероятная атмосфера.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 sm:mt-10 w-full px-2 sm:px-0" style={{ animationDelay: "0.35s" }}>
            <Link
              href="/events"
              className="group w-full sm:w-auto px-8 py-4 btn-gradient rounded-2xl text-[15px] font-bold tracking-wide animate-pulse-glow flex items-center justify-center gap-2.5"
            >
              <span className="relative z-10">БЛИЖАЙШИЕ СОБЫТИЯ</span>
              <svg className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contacts"
              className="w-full sm:w-auto px-8 py-4 btn-outline rounded-2xl text-[15px] font-bold tracking-wide text-center"
            >
              НАПИСАТЬ НАМ
            </Link>
          </div>

          {/* Countdown */}
          {nextEvent && (
            <div className="animate-fade-in-up mt-10 sm:mt-16" style={{ animationDelay: "0.45s" }}>
              <CountdownTimer targetDate={nextEvent.date} label={`ДО ${nextEvent.title}`} />
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "1s" }}>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-primary/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== FEATURED EVENT — HERO CARD ===== */}
      {nextEvent && (
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-primary/[0.02] to-bg-dark" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal>
              <div className="relative rounded-3xl overflow-hidden group featured-glow">
                <div className="absolute inset-0">
                  <img src={nextEvent.image} alt={nextEvent.title} className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 scale-105 group-hover:scale-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/5" />
                </div>

                <div className="relative z-10 p-5 sm:p-12 lg:p-16">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="tag tag-primary">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          БЛИЖАЙШЕЕ
                        </span>
                        <span className="tag tag-white">{nextEvent.ageLimit}</span>
                      </div>

                      <h2 className="text-2xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[0.9] mb-3 sm:mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                        {nextEvent.title}
                      </h2>
                      <p className="text-text-secondary text-sm sm:text-base mb-2">{nextEvent.subtitle}</p>

                      <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 mt-4 sm:mt-6">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" /></svg>
                          {nextEvent.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {nextEvent.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                          {nextEvent.venue}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-3">
                      {nextEvent.price > 0 ? (
                        <div className="text-3xl sm:text-4xl font-black gradient-text" style={{ fontFamily: "var(--font-heading)" }}>
                          от {nextEvent.price}{nextEvent.currency}
                        </div>
                      ) : (
                        <div className="text-2xl sm:text-3xl font-black gradient-text" style={{ fontFamily: "var(--font-heading)" }}>
                          КУПИТЬ БИЛЕТ
                        </div>
                      )}
                      <Link
                        href={`/events/${nextEvent.id}`}
                        className="group w-full sm:w-auto px-8 py-4 btn-gradient rounded-2xl text-[15px] font-bold tracking-wide flex items-center justify-center gap-2.5"
                      >
                        <span className="relative z-10">ПОДРОБНЕЕ</span>
                        <svg className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ===== UPCOMING EVENTS GRID ===== */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  ПРЕДСТОЯЩИЕ
                </h2>
                <p className="text-text-secondary mt-2 text-sm">Не пропусти ближайшие события</p>
              </div>
              <Link
                href="/events"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors group"
              >
                Все события
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {upcomingEvents.map((event, i) => (
              <ScrollReveal key={event.id} delay={i * 0.08}>
                <EventCard event={event} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/events" className="inline-flex items-center gap-2 px-6 py-3 btn-outline rounded-xl text-sm font-semibold">
              Все события
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== ABOUT / WHY US — BENTO GRID ===== */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                ПОЧЕМУ <span className="gradient-text">THE FAMILY</span>
              </h2>
              <p className="text-text-secondary mt-3 max-w-md mx-auto text-sm">
                Мы не просто организаторы — мы создаём впечатления
              </p>
            </div>
          </ScrollReveal>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Large card */}
            <ScrollReveal delay={0.05}>
              <div className="sm:col-span-2 sm:row-span-2 group relative rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/10 p-6 sm:p-10 overflow-hidden h-full min-h-[200px] sm:min-h-[280px] flex flex-col justify-end">
                <div className="absolute top-6 right-6 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3" style={{ fontFamily: "var(--font-heading)" }}>ЛУЧШИЙ ЗВУК</h3>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                    Профессиональное оборудование Funktion-One и d&b audiotechnik. Каждая нота — как в студии.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Small cards */}
            <ScrollReveal delay={0.1}>
              <div className="group rounded-3xl bg-bg-card border border-border p-6 hover:border-rose-500/20 transition-all h-full min-h-[130px] flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>АТМОСФЕРА</h3>
                  <p className="text-text-muted text-xs">Энергетика, которую не передать словами</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="group rounded-3xl bg-bg-card border border-border p-6 hover:border-amber-500/20 transition-all h-full min-h-[130px] flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>АРТИСТЫ</h3>
                  <p className="text-text-muted text-xs">Топовые DJ и секретные гости</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="group rounded-3xl bg-bg-card border border-border p-6 hover:border-emerald-500/20 transition-all h-full min-h-[130px] flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>ОТ 400₽</h3>
                  <p className="text-text-muted text-xs">Доступные цены и промокоды</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <div className="group rounded-3xl bg-bg-card border border-border p-6 hover:border-cyan-500/20 transition-all h-full min-h-[130px] flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>ФОТОЗОНЫ</h3>
                  <p className="text-text-muted text-xs">Профессиональная съёмка</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {[
              { value: "50+", label: "Мероприятий" },
              { value: "30K+", label: "Гостей" },
              { value: "15+", label: "Площадок" },
              { value: "100+", label: "Артистов" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={0.3 + i * 0.05}>
                <div className="rounded-2xl bg-bg-card/50 border border-border p-5 text-center">
                  <div className="text-2xl sm:text-3xl font-black gradient-text" style={{ fontFamily: "var(--font-heading)" }}>
                    {stat.value}
                  </div>
                  <div className="mono-label mt-1.5 text-[10px]">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== VENUE MAP ===== */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <ScrollReveal direction="left">
              <VenueMap />
            </ScrollReveal>

            <ScrollReveal delay={0.15} direction="right">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    НАШИ ПЛОЩАДКИ
                  </h2>
                  <p className="text-text-secondary mt-3 text-sm leading-relaxed">
                    Только проверенные клубы с идеальным звуком и атмосферой. Каждая площадка подобрана под формат мероприятия.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: "M9 19V6l12-3v13", label: "Профессиональный звук", desc: "Funktion-One, d&b audiotechnik" },
                    { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Световое шоу", desc: "Лазеры, LED-панели, стробоскопы" },
                    { icon: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175", label: "Фото и видео", desc: "Профессиональная съёмка на каждом событии" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-4 rounded-2xl bg-bg-card border border-border hover:border-border-light transition-all">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{item.label}</div>
                        <div className="text-text-muted text-xs mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== PAST EVENTS ===== */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  ПРОШЕДШИЕ
                </h2>
                <p className="text-text-secondary mt-2 text-sm">Как это было</p>
              </div>
              <Link
                href="/past"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-light transition-colors group"
              >
                Все прошедшие
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pastEvents.map((event, i) => (
              <ScrollReveal key={event.id} delay={i * 0.08}>
                <EventCard event={event} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== CTA — JOIN US ===== */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="scale">
            <div className="relative rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-card to-accent/10" />
              <div className="absolute inset-0 grid-pattern opacity-30" />

              <div className="relative z-10 p-6 sm:p-16 lg:p-20">
                <img src="/Familylogo.png" alt="THE FAMILY" className="w-16 h-16 mx-auto mb-8 rounded-2xl opacity-80" />

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  СТАНЬ ЧАСТЬЮ{" "}
                  <span className="gradient-text">СЕМЬИ</span>
                </h2>
                <p className="text-text-secondary text-sm sm:text-base mb-10 max-w-lg mx-auto leading-relaxed">
                  Подпишись на наши соцсети — будь первым, кто узнает о новых событиях и получит эксклюзивные промокоды.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full">
                  <a href="https://t.me/familymsk" target="_blank" rel="noopener noreferrer"
                    className="group w-full sm:w-auto px-7 py-3.5 btn-gradient rounded-2xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5">
                    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    <span className="relative z-10">TELEGRAM</span>
                  </a>
                  <a href="https://vk.ru/thefamilymskk" target="_blank" rel="noopener noreferrer"
                    className="group w-full sm:w-auto px-7 py-3.5 btn-outline rounded-2xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.85 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.624 2.168-3.624.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
                    ВКОНТАКТЕ
                  </a>
                  <a href="https://www.instagram.com/thefamily_msk" target="_blank" rel="noopener noreferrer"
                    className="group w-full sm:w-auto px-7 py-3.5 btn-outline rounded-2xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                    INSTAGRAM
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

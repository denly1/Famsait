export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from "react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import CountdownTimer from "@/components/CountdownTimer";
import ScrollReveal from "@/components/ScrollReveal";
import MarqueeText from "@/components/MarqueeText";
import FloatingElements from "@/components/FloatingElements";
import EventTimeline from "@/components/EventTimeline";
import PastEventsGrid from "@/components/PastEventsGrid";
import EventImage from "@/components/EventImage";
import VenueMap from "@/components/VenueMap";
import { mapEventsFromDB } from "@/lib/mappers";
import { query } from "@/lib/db";

async function getEvents() {
  try {
    // Автоматически переносим прошедшие события
    try {
      await query(`UPDATE events SET is_past = true, updated_at = NOW() WHERE is_past = false AND date ~ '^[0-9]{2}\\.[0-9]{2}\\.[0-9]{4}$' AND TO_DATE(date, 'DD.MM.YYYY') < CURRENT_DATE`);
    } catch {}
    const result = await query("SELECT * FROM events ORDER BY date DESC");
    return { events: mapEventsFromDB(result.rows || []) };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { events: [] };
  }
}

async function getSettings() {
  try {
    const result = await query("SELECT * FROM site_settings WHERE id = 1");
    if (result.rows.length === 0) return null;
    const r = result.rows[0];
    return {
      telegramUrl: r.telegram_url || "https://t.me/familymsk",
      vkUrl: r.vk_url || "https://vk.ru/thefamilymskk",
      instagramUrl: r.instagram_url || "https://www.instagram.com/thefamily_msk",
    };
  } catch {
    return { telegramUrl: "https://t.me/familymsk", vkUrl: "https://vk.ru/thefamilymskk", instagramUrl: "https://www.instagram.com/thefamily_msk" };
  }
}

export default async function HomePage() {
  const { events } = await getEvents();
  const settings = await getSettings();
  const upcomingEvents = events
    .filter((e: any) => !e.isPast)
    .sort((a: any, b: any) => {
      // Parse DD.MM.YYYY → comparable date
      const parse = (d: string) => {
        const [dd, mm, yyyy] = d.split(".");
        return new Date(`${yyyy}-${mm}-${dd}`).getTime() || 0;
      };
      return parse(a.date) - parse(b.date);
    })
    .slice(0, 4);
  const pastEvents = events.filter((e: any) => e.isPast).slice(0, 3);
  const nextEvent = upcomingEvents[0];

  // JSON-LD structured data для SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FAMILY Moscow",
    "url": "https://family-events.ru",
    "logo": "https://family-events.ru/Familylogo.png",
    "description": "Лучшие вечеринки и мероприятия в Москве",
    "sameAs": [
      settings?.telegramUrl || "https://t.me/familymsk",
      settings?.vkUrl || "https://vk.ru/thefamilymskk",
      settings?.instagramUrl || "https://www.instagram.com/thefamily_msk"
    ]
  };

  const eventsSchema = upcomingEvents.slice(0, 3).map((event: any) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description || `${event.title} — событие от FAMILY Moscow`,
    "image": event.image ? `https://family-events.ru${event.image}` : "https://family-events.ru/Familylogo.png",
    "startDate": event.date && event.time ? `${event.date.split('.').reverse().join('-')}T${event.time}` : undefined,
    "location": {
      "@type": "Place",
      "name": event.venue || "Москва",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Москва",
        "addressCountry": "RU"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "FAMILY Moscow",
      "url": "https://family-events.ru"
    },
    "offers": event.price > 0 ? {
      "@type": "Offer",
      "price": event.price,
      "priceCurrency": event.currency || "RUB",
      "url": event.ticketLink || event.ticketUrl || `https://family-events.ru/events/${event.id}`,
      "availability": "https://schema.org/InStock"
    } : undefined
  }));

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {eventsSchema.map((schema: any, i: number) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ===== FLOATING BACKGROUND ELEMENTS ===== */}
      <FloatingElements />


      {/* ===== FEATURED EVENT ===== */}
      {nextEvent && (
        <section className="relative pt-44 sm:pt-56 md:pt-60 pb-6 sm:pb-10 lg:pb-14 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal>
              <div className="relative rounded-3xl overflow-hidden group">
                {/* Image — visible and large */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/2] overflow-hidden">
                  <EventImage src={nextEvent.image} alt={nextEvent.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Compact overlay content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-lg text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                      БЛИЖАЙШЕЕ СОБЫТИЕ
                    </span>
                    {nextEvent.ageLimit && (
                      <span className="px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-lg text-[10px] sm:text-xs font-bold text-white">
                        {nextEvent.ageLimit}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] text-white mb-2 sm:mb-3 drop-shadow-lg" style={{ fontFamily: "var(--font-heading)" }}>
                    {nextEvent.title}
                  </h2>

                  {/* Info row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-white/80 mb-4">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" /></svg>
                      {nextEvent.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {nextEvent.time}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                      {nextEvent.venue}
                    </span>
                    {nextEvent.price > 0 && (
                      <span className="font-black text-sm sm:text-base text-white">от {nextEvent.price}{nextEvent.currency}</span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <Link
                      href={nextEvent.ticketLink || nextEvent.ticketUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 sm:px-8 py-3 bg-white text-black rounded-xl text-xs sm:text-sm font-black tracking-wide hover:bg-white/90 transition-all active:scale-95"
                    >
                      КУПИТЬ БИЛЕТ
                    </Link>
                    <Link
                      href={`/events/${nextEvent.id}`}
                      className="px-6 sm:px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl text-xs sm:text-sm font-black tracking-wide hover:bg-white/20 transition-all active:scale-95"
                    >
                      ПОДРОБНЕЕ
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ===== COUNTDOWN ===== */}
      {nextEvent && nextEvent.date && (
        <section className="pt-0 sm:pt-1 pb-6 sm:pb-8 relative">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <CountdownTimer targetDate={nextEvent.date} targetTime={nextEvent.time} label="ДО БЛИЖАЙШЕГО СОБЫТИЯ" />
          </div>
        </section>
      )}

      {/* ===== MARQUEE TEXT ===== */}
      <div className="relative overflow-hidden bg-black border-y border-white/10 py-6">
        <div className="flex animate-marquee whitespace-nowrap">
          {[0, 1].map((group) => (
            <div key={group} aria-hidden={group === 1} className="flex shrink-0 items-center">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="inline-flex items-center mx-6 sm:mx-8 text-4xl sm:text-5xl lg:text-6xl leading-none text-white uppercase select-none" style={{ fontFamily: "'Arial Black', Impact, sans-serif", fontWeight: 900, letterSpacing: "0.02em" }}>
                  FAMILY MOSCOW<span className="mx-3 sm:mx-4 text-primary">•</span>ЛУЧШИЕ ТУСОВКИ СТОЛИЦЫ<span className="mx-3 sm:mx-4 text-primary">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== EVENT TIMELINE ===== */}
      <EventTimeline events={upcomingEvents} />

      <div className="section-divider" />

      {/* ===== UPCOMING EVENTS GRID ===== */}
      <section className="py-16 sm:py-24 relative hidden">
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
            {upcomingEvents.map((event: any, i: number) => (
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
                ПОЧЕМУ <span className="gradient-text text-4xl sm:text-6xl">FAMILY</span>
              </h2>
              <p className="text-white/70 mt-3 max-w-md mx-auto text-sm sm:text-base">
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
                  <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                    Профессиональное звуковое оборудование. Кристально чистый звук на каждом событии.
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
                  <p className="text-white/60 text-xs">Энергетика, которую не передать словами</p>
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
                  <p className="text-white/60 text-xs">Топовые DJ и секретные гости</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="group rounded-3xl bg-bg-card border border-border p-6 hover:border-cyan-500/20 transition-all h-full min-h-[130px] flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>ФОТОЗОНЫ</h3>
                  <p className="text-white/60 text-xs">Профессиональная съёмка</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 max-w-lg mx-auto w-full">
            {[
              { value: "200+", label: "Мероприятий", color: "from-white/[0.06] to-white/[0.02]", border: "border-white/10" },
              { value: "100K+", label: "Гостей", color: "from-white/[0.06] to-white/[0.02]", border: "border-white/10" },
            ].map((stat: any, i: number) => (
              <ScrollReveal key={stat.label} delay={0.3 + i * 0.05}>
                <div className={`rounded-2xl sm:rounded-3xl bg-gradient-to-br ${stat.color} border ${stat.border} p-6 sm:p-8 text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
                  <div className="text-3xl sm:text-5xl font-black gradient-text" style={{ fontFamily: "var(--font-heading)" }}>
                    {stat.value}
                  </div>
                  <div className="text-white/60 mt-2 text-xs sm:text-sm uppercase tracking-wider font-semibold">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== VENUES SECTION ===== */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                ЛОКАЦИИ ПРОВЕДЕНИЯ
              </h2>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight mt-2" style={{ fontFamily: "var(--font-heading)" }}>
                НАШИХ <span className="gradient-text">МЕРОПРИЯТИЙ</span>
              </h3>
            </div>
          </ScrollReveal>

          {/* Venue Map */}
          <ScrollReveal>
            <VenueMap />
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== PAST EVENTS ===== */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                ПРОШЕДШИЕ СОБЫТИЯ
              </h2>
              <p className="text-white/70 mt-2 text-sm sm:text-base">Посмотри список наших легендарных событий</p>
            </div>
          </ScrollReveal>

          <PastEventsGrid events={pastEvents} />

          <div className="text-center mt-8">
            <Link
              href="/past"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-xl text-sm font-bold tracking-wide hover:bg-white/10 hover:border-white/50 transition-all active:scale-95"
            >
              ВСЕ ПРОШЕДШИЕ
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
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
                <img src="/Familylogo.png" alt="FAMILY" className="w-16 h-16 mx-auto mb-8 rounded-2xl opacity-80" />

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  СТАНЬ ЧАСТЬЮ{" "}
                  <span className="gradient-text">СЕМЬИ</span>
                </h2>
                <p className="text-white/70 text-sm sm:text-base mb-10 max-w-lg mx-auto leading-relaxed">
                  Подпишись на наши соцсети — будь первым, кто узнает о новых событиях и получит эксклюзивные промокоды.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full">
                  <a href={settings?.telegramUrl || "https://t.me/familymsk"} target="_blank" rel="noopener noreferrer"
                    className="group w-full sm:w-auto px-7 py-3.5 bg-white text-black rounded-2xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5 hover:bg-white/90 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    TELEGRAM
                  </a>
                  <a href={settings?.vkUrl || "https://vk.ru/thefamilymskk"} target="_blank" rel="noopener noreferrer"
                    className="group w-full sm:w-auto px-7 py-3.5 border-2 border-white/30 text-white rounded-2xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/50 transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.85 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.624 2.168-3.624.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
                    ВКОНТАКТЕ
                  </a>
                  <a href={settings?.instagramUrl || "https://www.instagram.com/thefamily_msk"} target="_blank" rel="noopener noreferrer"
                    className="group w-full sm:w-auto px-7 py-3.5 border-2 border-white/30 text-white rounded-2xl text-sm font-bold tracking-wide flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/50 transition-all">
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
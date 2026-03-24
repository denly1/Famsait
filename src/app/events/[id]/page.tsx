export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import { mapEventFromDB } from "@/lib/mappers";
import { query } from "@/lib/db";
import EventImage from "@/components/EventImage";

async function getEvent(id: string) {
  try {
    const result = await query("SELECT * FROM events WHERE id = $1", [id]);
    if (result.rows.length === 0) return null;
    return mapEventFromDB(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  
  if (!event) {
    return (
      <div className="pt-44 sm:pt-56 pb-20 text-center">
        <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Мероприятие не найдено</h1>
        <Link href="/events" className="text-primary mt-4 inline-block hover:underline text-sm">
          ← Назад к мероприятиям
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Sticky buy button at bottom on mobile */}
      {!event.isPast && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 lg:hidden">
          <a
            href={event.ticketUrl}
            target={event.ticketUrl?.startsWith("http") ? "_blank" : undefined}
            rel={event.ticketUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center justify-center py-4 bg-white text-black rounded-2xl font-black text-base tracking-wide w-full active:scale-[0.98] transition-all"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            КУПИТЬ БИЛЕТ
          </a>
        </div>
      )}

      <div className="pt-24 sm:pt-28 pb-28 lg:pb-12 relative">
        <div className="glow-orb glow-orb-purple w-[400px] h-[400px] -top-20 -right-20 opacity-20 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

          {/* Back link */}
          <Link
            href={event.isPast ? "/past" : "/events"}
            className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all group text-xs font-semibold text-white/60 hover:text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            НАЗАД
          </Link>

          <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">

            {/* Poster — compact on mobile */}
            <div className="lg:w-[42%] flex-shrink-0">
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black
                              max-h-[38vh] lg:max-h-none flex items-center justify-center">
                <EventImage
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-contain max-h-[38vh] lg:max-h-[75vh]"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-3">

              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}>
                  {event.title}
                </h1>
                {event.subtitle && (
                  <p className="text-sm text-text-secondary">{event.subtitle}</p>
                )}
              </div>

              {/* Date & Venue */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-bg-card border border-white/10">
                  <div className="text-[9px] font-medium tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-mono)" }}>ДАТА</div>
                  <div className="font-black text-sm sm:text-base text-white" style={{ fontFamily: "var(--font-heading)" }}>{event.date}</div>
                  {event.time && <div className="text-xs text-white/50">{event.time}</div>}
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-bg-card border border-white/10">
                  <div className="text-[9px] font-medium tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-mono)" }}>МЕСТО</div>
                  <div className="font-black text-sm sm:text-base text-white" style={{ fontFamily: "var(--font-heading)" }}>{event.venue}</div>
                  {event.address && <div className="text-xs text-white/50 leading-snug">{event.address}</div>}
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <p className="text-white/65 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
              )}

              {/* Lineup */}
              {event.lineup.length > 0 && (
                <div className="rounded-xl bg-bg-card border border-white/10 overflow-hidden">
                  <div className="px-3 py-2 border-b border-white/[0.06]">
                    <span className="text-[9px] font-medium tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-mono)" }}>ЛАЙНАП</span>
                  </div>
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {event.lineup.map((artist: string) => (
                      <span key={artist} className="px-3 py-1.5 rounded-lg border border-white/15 text-xs font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {event.features.length > 0 && (
                <div className="rounded-xl bg-bg-card border border-white/10 overflow-hidden">
                  <div className="px-3 py-2 border-b border-white/[0.06]">
                    <span className="text-[9px] font-medium tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-mono)" }}>ФИШКИ</span>
                  </div>
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {event.features.map((feature: string) => (
                      <span key={feature} className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-bold">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Buy button — desktop only (mobile has sticky bottom) */}
              {!event.isPast && (
                <a
                  href={event.ticketUrl}
                  target={event.ticketUrl?.startsWith("http") ? "_blank" : undefined}
                  rel={event.ticketUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="hidden lg:flex items-center justify-center py-4 bg-white text-black rounded-2xl font-black text-lg tracking-wide w-full hover:bg-white/90 active:scale-[0.98] transition-all mt-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  КУПИТЬ БИЛЕТ
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
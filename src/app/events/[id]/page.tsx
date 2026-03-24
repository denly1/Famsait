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
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "calc(100dvh - 64px)" }}
    >
      {/* Back link */}
      <div className="flex-shrink-0 px-3 pt-2 pb-1">
        <Link
          href={event.isPast ? "/past" : "/events"}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-all group text-[11px] font-semibold text-white/60 hover:text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          НАЗАД
        </Link>
      </div>

      {/* Main: poster + info side by side on desktop, stacked on mobile */}
      <div className="flex-1 flex flex-col lg:flex-row gap-2 px-3 pb-3 min-h-0">

        {/* Poster */}
        <div className="lg:w-[38%] flex-shrink-0 rounded-xl overflow-hidden border border-white/10 bg-zinc-950
                        h-[30vh] lg:h-full">
          <EventImage
            src={event.image}
            alt={event.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info + button */}
        <div className="flex-1 flex flex-col min-h-0 gap-2">

          {/* Scrollable info */}
          <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: "none" }}>

            <h1
              className="text-[22px] sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-0.5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="text-[11px] text-white/50 mb-2">{event.subtitle}</p>
            )}

            {/* Date & Venue */}
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-bg-card border border-white/10">
                <div className="text-[8px] tracking-widest text-white/35 uppercase font-medium" style={{ fontFamily: "var(--font-mono)" }}>ДАТА</div>
                <div className="font-black text-[13px] text-white" style={{ fontFamily: "var(--font-heading)" }}>{event.date}</div>
                {event.time && <div className="text-[11px] text-white/45">{event.time}</div>}
              </div>
              <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-bg-card border border-white/10">
                <div className="text-[8px] tracking-widest text-white/35 uppercase font-medium" style={{ fontFamily: "var(--font-mono)" }}>МЕСТО</div>
                <div className="font-black text-[13px] text-white leading-tight" style={{ fontFamily: "var(--font-heading)" }}>{event.venue}</div>
                {event.address && <div className="text-[11px] text-white/45 leading-snug">{event.address}</div>}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <p className="text-white/55 text-[11px] sm:text-xs leading-relaxed mb-2 whitespace-pre-line">{event.description}</p>
            )}

            {/* Lineup */}
            {event.lineup.length > 0 && (
              <div className="mb-2 rounded-xl bg-bg-card border border-white/10 overflow-hidden">
                <div className="px-3 py-1.5 border-b border-white/[0.06]">
                  <span className="text-[8px] tracking-widest text-white/35 uppercase font-medium" style={{ fontFamily: "var(--font-mono)" }}>ЛАЙНАП</span>
                </div>
                <div className="p-2.5 flex flex-wrap gap-1">
                  {event.lineup.map((artist: string) => (
                    <span key={artist} className="px-2.5 py-1 rounded-lg border border-white/15 text-[11px] font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {event.features.length > 0 && (
              <div className="mb-2 rounded-xl bg-bg-card border border-white/10 overflow-hidden">
                <div className="px-3 py-1.5 border-b border-white/[0.06]">
                  <span className="text-[8px] tracking-widest text-white/35 uppercase font-medium" style={{ fontFamily: "var(--font-mono)" }}>ФИШКИ</span>
                </div>
                <div className="p-2.5 flex flex-wrap gap-1">
                  {event.features.map((feature: string) => (
                    <span key={feature} className="px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/5 text-primary text-[11px] font-bold">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buy button — always at bottom */}
          {!event.isPast ? (
            <div className="flex-shrink-0">
              <a
                href={event.ticketUrl}
                target={event.ticketUrl?.startsWith("http") ? "_blank" : undefined}
                rel={event.ticketUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center justify-center py-3.5 bg-white text-black rounded-xl font-black text-sm tracking-wide w-full hover:bg-white/90 active:scale-[0.98] transition-all"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                КУПИТЬ БИЛЕТ
              </a>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center py-3 rounded-xl border border-white/10 text-white/30 text-xs font-bold tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>
                МЕРОПРИЯТИЕ ЗАВЕРШЕНО
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
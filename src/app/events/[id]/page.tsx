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
    <div className="pt-44 sm:pt-56 pb-16 sm:pb-20 relative">
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
            <div className="rounded-2xl overflow-hidden card-glow border border-border bg-black">
              <EventImage
                src={event.image}
                alt={event.title}
                className="w-full h-auto block"
              />
            </div>
          </div>

          {/* Info */}
          <div className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              {event.title}
            </h1>
            <p className="text-base sm:text-lg text-text-secondary font-medium mb-6 sm:mb-8">{event.subtitle}</p>

            {/* Date & Venue cards */}
            <div className="grid grid-cols-2 gap-3 mb-6 sm:mb-8">
              <div className="flex flex-col gap-1.5 p-4 sm:p-5 rounded-2xl bg-bg-card border border-white/10">
                <div className="text-[10px] font-medium tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-mono)" }}>ДАТА</div>
                <div className="font-black text-[17px] sm:text-xl text-white" style={{ fontFamily: "var(--font-heading)" }}>{event.date}</div>
                {event.time && <div className="text-sm text-white/50 font-medium">{event.time}</div>}
              </div>
              <div className="flex flex-col gap-1.5 p-4 sm:p-5 rounded-2xl bg-bg-card border border-white/10">
                <div className="text-[10px] font-medium tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-mono)" }}>МЕСТО</div>
                <div className="font-black text-[17px] sm:text-xl text-white" style={{ fontFamily: "var(--font-heading)" }}>{event.venue}</div>
                {event.address && <div className="text-sm text-white/50 font-medium leading-snug">{event.address}</div>}
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-[14px] sm:text-[15px] leading-relaxed mb-6 sm:mb-8 whitespace-pre-line">{event.description}</p>

            {/* Lineup */}
            {event.lineup.length > 0 && (
              <div className="mb-6 sm:mb-8 rounded-2xl bg-bg-card border border-white/10 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <span className="text-[10px] font-medium tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-mono)" }}>ЛАЙНАП</span>
                </div>
                <div className="p-4 sm:p-5 flex flex-wrap gap-2">
                  {event.lineup.map((artist: string) => (
                    <span
                      key={artist}
                      className="px-4 py-2 rounded-xl border border-white/15 text-sm font-bold text-white hover:border-white/30 hover:bg-white/5 transition-all cursor-default"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {event.features.length > 0 && (
              <div className="mb-6 sm:mb-8 rounded-2xl bg-bg-card border border-white/10 overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <span className="text-[10px] font-medium tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-mono)" }}>ФИШКИ</span>
                </div>
                <div className="p-4 sm:p-5 flex flex-wrap gap-2">
                  {event.features.map((feature: string) => (
                    <span key={feature} className="px-4 py-2 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-bold">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ticket Section */}
            {!event.isPast && (
              <a
                href={event.ticketUrl}
                target={event.ticketUrl?.startsWith("http") ? "_blank" : undefined}
                rel={event.ticketUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center justify-center px-6 py-5 bg-white text-black rounded-2xl font-black text-lg tracking-wide w-full hover:bg-white/90 active:scale-[0.98] transition-all"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                КУПИТЬ БИЛЕТ
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
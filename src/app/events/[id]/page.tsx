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
    <div className="pb-6 pt-16">

      {/* ── POSTER full width ── */}
      <div className="w-full">
        <EventImage
          src={event.image}
          alt={event.title}
          className="w-full h-auto block"
        />
      </div>

      <div className="px-4 pt-4 max-w-2xl mx-auto">

        {/* Title */}
        <h1
          className="text-xl sm:text-2xl font-black tracking-tight leading-tight mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {event.title}
        </h1>

        {event.subtitle && (
          <p className="text-sm text-white/50 mb-4 -mt-2">{event.subtitle}</p>
        )}

        {(event as any).isDouble ? (
          /* === DOUBLE EVENT: 2 columns DAY1 / DAY2 === */
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {/* DAY 1 */}
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] tracking-widest text-primary uppercase font-bold mb-1" style={{ fontFamily: "var(--font-mono)" }}>DAY 1</div>
                <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>{event.date}</div>
                {event.time && <div className="text-xs text-white/50">{event.time}</div>}
                <div className="text-sm font-bold text-white mt-1" style={{ fontFamily: "var(--font-heading)" }}>{event.venue}</div>
                {event.address && <div className="text-xs text-white/40">{event.address}</div>}
              </div>
              {/* DAY 2 */}
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] tracking-widest text-primary uppercase font-bold mb-1" style={{ fontFamily: "var(--font-mono)" }}>DAY 2</div>
                <div className="text-sm font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>{(event as any).day2Date}</div>
                {(event as any).day2Time && <div className="text-xs text-white/50">{(event as any).day2Time}</div>}
                <div className="text-sm font-bold text-white mt-1" style={{ fontFamily: "var(--font-heading)" }}>{(event as any).day2Venue}</div>
                {(event as any).day2Address && <div className="text-xs text-white/40">{(event as any).day2Address}</div>}
              </div>
            </div>
            {/* Buttons DAY1 / DAY2 */}
            {!event.isPast ? (
              <div className="grid grid-cols-2 gap-2 mb-5">
                <a
                  href={event.ticketUrl}
                  target={event.ticketUrl?.startsWith("http") ? "_blank" : undefined}
                  rel={event.ticketUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-center py-4 bg-white text-black rounded-2xl font-black text-sm tracking-wide hover:bg-white/90 active:scale-[0.98] transition-all"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  DAY 1
                </a>
                <a
                  href={(event as any).day2TicketUrl || "#"}
                  target={(event as any).day2TicketUrl?.startsWith("http") ? "_blank" : undefined}
                  rel={(event as any).day2TicketUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-center py-4 bg-white/10 border border-white/30 text-white rounded-2xl font-black text-sm tracking-wide hover:bg-white/20 active:scale-[0.98] transition-all"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  DAY 2
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center py-3.5 rounded-2xl border border-white/10 text-white/30 text-sm font-bold tracking-widest mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                МЕРОПРИЯТИЕ ЗАВЕРШЕНО
              </div>
            )}
          </>
        ) : (
          /* === SINGLE EVENT === */
          <>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] tracking-widest text-white/40 uppercase font-bold" style={{ fontFamily: "var(--font-mono)" }}>ДАТА</div>
                <div className="text-base font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>{event.date}</div>
              </div>
              <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] tracking-widest text-white/40 uppercase font-bold" style={{ fontFamily: "var(--font-mono)" }}>ВРЕМЯ</div>
                <div className="text-base font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>{event.time || "—"}</div>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
              <div className="text-[10px] tracking-widest text-white/40 uppercase font-bold" style={{ fontFamily: "var(--font-mono)" }}>МЕСТО</div>
              <div className="text-base font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>{event.venue}</div>
              {event.address && <div className="text-sm text-white/50">{event.address}</div>}
            </div>
            {!event.isPast ? (
              <a
                href={event.ticketUrl}
                target={event.ticketUrl?.startsWith("http") ? "_blank" : undefined}
                rel={event.ticketUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center justify-center py-4 bg-white text-black rounded-2xl font-black text-base tracking-wide w-full hover:bg-white/90 active:scale-[0.98] transition-all mb-5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                КУПИТЬ БИЛЕТ
              </a>
            ) : (
              <div className="flex items-center justify-center py-3.5 rounded-2xl border border-white/10 text-white/30 text-sm font-bold tracking-widest mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                МЕРОПРИЯТИЕ ЗАВЕРШЕНО
              </div>
            )}
          </>
        )}

        {/* ── Below fold: description, lineup, features ── */}
        {(event as any).isDouble ? (
          /* === DOUBLE: show DAY 1 / DAY 2 sections separately === */
          <>
            {(event.description || event.lineup.length > 0 || event.features.length > 0) && (
              <div className="mb-5 pb-5 border-b border-white/10">
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-3" style={{ fontFamily: "var(--font-mono)" }}>DAY 1</p>
                {event.description && (
                  <div className="mb-4">
                    <div className="text-xs tracking-widest text-white/60 uppercase font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>ОПИСАНИЕ</div>
                    <p className="text-white/85 text-base leading-relaxed whitespace-pre-line">{event.description}</p>
                  </div>
                )}
                {event.lineup.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs tracking-widest text-white/60 uppercase font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>ЛАЙНАП</div>
                    <div className="flex flex-wrap gap-2">
                      {event.lineup.map((artist: string) => (
                        <span key={artist} className="px-3 py-1.5 rounded-xl border border-white/15 text-sm font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{artist}</span>
                      ))}
                    </div>
                  </div>
                )}
                {event.features.length > 0 && (
                  <div>
                    <div className="text-xs tracking-widest text-white/60 uppercase font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>ФИШКИ</div>
                    <div className="flex flex-wrap gap-2">
                      {event.features.map((f: string) => (
                        <span key={f} className="px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-bold">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {((event as any).day2Description || ((event as any).day2Lineup?.length > 0) || ((event as any).day2Features?.length > 0)) && (
              <div className="mb-5">
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-3" style={{ fontFamily: "var(--font-mono)" }}>DAY 2</p>
                {(event as any).day2Description && (
                  <div className="mb-4">
                    <div className="text-xs tracking-widest text-white/60 uppercase font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>ОПИСАНИЕ</div>
                    <p className="text-white/85 text-base leading-relaxed whitespace-pre-line">{(event as any).day2Description}</p>
                  </div>
                )}
                {(event as any).day2Lineup?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs tracking-widest text-white/60 uppercase font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>ЛАЙНАП</div>
                    <div className="flex flex-wrap gap-2">
                      {(event as any).day2Lineup.map((artist: string) => (
                        <span key={artist} className="px-3 py-1.5 rounded-xl border border-white/15 text-sm font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{artist}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(event as any).day2Features?.length > 0 && (
                  <div>
                    <div className="text-xs tracking-widest text-white/60 uppercase font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>ФИШКИ</div>
                    <div className="flex flex-wrap gap-2">
                      {(event as any).day2Features.map((f: string) => (
                        <span key={f} className="px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-bold">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* === SINGLE EVENT === */
          <>
            {event.description && (
              <div className="mb-5">
                <div className="text-xs tracking-widest text-white/60 uppercase font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>ОПИСАНИЕ</div>
                <p className="text-white/85 text-base leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            )}
            {event.lineup.length > 0 && (
              <div className="mb-5">
                <div className="text-xs tracking-widest text-white/60 uppercase font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>ЛАЙНАП</div>
                <div className="flex flex-wrap gap-2">
                  {event.lineup.map((artist: string) => (
                    <span key={artist} className="px-3 py-1.5 rounded-xl border border-white/15 text-sm font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{artist}</span>
                  ))}
                </div>
              </div>
            )}
            {event.features.length > 0 && (
              <div className="mb-5">
                <div className="text-xs tracking-widest text-white/60 uppercase font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>ФИШКИ</div>
                <div className="flex flex-wrap gap-2">
                  {event.features.map((feature: string) => (
                    <span key={feature} className="px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-bold">{feature}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
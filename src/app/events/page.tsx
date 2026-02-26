export const dynamic = 'force-dynamic';
export const revalidate = 0;

import EventCard from "@/components/EventCard";
import { mapEventsFromDB } from "@/lib/mappers";
import { query } from "@/lib/db";

async function getEvents() {
  try {
    // Автоматически переносим прошедшие события
    try {
      await query(`UPDATE events SET is_past = true, updated_at = NOW() WHERE is_past = false AND date ~ '^[0-9]{2}\\.[0-9]{2}\\.[0-9]{4}$' AND TO_DATE(date, 'DD.MM.YYYY') < CURRENT_DATE`);
    } catch {}
    const result = await query("SELECT * FROM events WHERE is_past = false ORDER BY date DESC");
    return { events: mapEventsFromDB(result.rows || []) };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { events: [] };
  }
}

export default async function EventsPage() {
  const { events: upcomingEvents } = await getEvents();

  return (
    <div className="pt-44 sm:pt-56 pb-16 sm:pb-20 relative">
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 -right-40 opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-14">
          <span className="tag tag-primary mb-3 sm:mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            АФИША
          </span>
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            МЕРОПРИЯТИЯ
          </h1>
          <p className="text-text-secondary mt-3 sm:mt-4 max-w-xl text-[14px] sm:text-[15px] leading-relaxed">
            Все предстоящие события от Family. Выбирай своё и бронируй билеты заранее — места ограничены!
          </p>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 stagger-children">
            {upcomingEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Пока нет предстоящих событий</h3>
            <p className="text-text-secondary text-sm">Подпишись на наш Telegram, чтобы первым узнать о новых мероприятиях</p>
          </div>
        )}
      </div>
    </div>
  );
}
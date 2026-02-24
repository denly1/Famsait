import EventCard from "@/components/EventCard";
import { mapEventsFromDB } from "@/lib/mappers";

async function getEvents() {
  try {
    const baseUrl = typeof window === 'undefined' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    const res = await fetch(`${baseUrl}/api/events?isPast=true`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) return { events: [] };
    
    const data = await res.json();
    return { events: mapEventsFromDB(data.events || []) };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { events: [] };
  }
}

export default async function PastEventsPage() {
  const { events: pastEvents } = await getEvents();

  return (
    <div className="pt-20 sm:pt-32 pb-16 sm:pb-20 relative">
      <div className="glow-orb glow-orb-pink w-[500px] h-[500px] -top-40 -left-40 opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-14">
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            ПРОШЕДШИЕ СОБЫТИЯ
          </h1>
          <p className="text-text-secondary mt-3 sm:mt-4 max-w-xl text-[14px] sm:text-[15px] leading-relaxed">
            Вспомни, как это было! Фотографии и детали наших прошедших событий.
          </p>
        </div>

        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 stagger-children">
            {pastEvents.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Пока нет прошедших событий</h3>
            <p className="text-text-secondary text-sm">Скоро здесь появятся фотоотчёты!</p>
          </div>
        )}
      </div>
    </div>
  );
}
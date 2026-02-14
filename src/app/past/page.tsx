import { events } from "@/lib/data";
import EventCard from "@/components/EventCard";

export default function PastEventsPage() {
  const pastEvents = events.filter((e) => e.isPast);

  return (
    <div className="pt-20 sm:pt-32 pb-16 sm:pb-20 relative">
      <div className="glow-orb glow-orb-pink w-[500px] h-[500px] -top-40 -left-40 opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-14">
          <span className="tag tag-accent mb-3 sm:mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            АРХИВ
          </span>
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            ПРОШЕДШИЕ
          </h1>
          <p className="text-text-secondary mt-3 sm:mt-4 max-w-xl text-[14px] sm:text-[15px] leading-relaxed">
            Вспомни, как это было! Фотографии и детали наших прошедших событий.
          </p>
        </div>

        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 stagger-children">
            {pastEvents.map((event) => (
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

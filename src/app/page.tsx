import Link from "next/link";
import { events } from "@/lib/data";
import EventCard from "@/components/EventCard";

export default function HomePage() {
  const upcomingEvents = events.filter((e) => !e.isPast).slice(0, 4);
  const nextEvent = upcomingEvents[0];

  return (
    <>
      {/* ===== HERO HEADER ===== */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-8 sm:pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="font-black tracking-tight leading-[1.1]" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="block text-[36px] sm:text-6xl md:text-7xl lg:text-8xl gradient-text mb-2 sm:mb-3">
                КУЛЬТОВЫЕ ВЕЧЕРИНКИ
              </span>
              <span className="block text-[32px] sm:text-5xl md:text-6xl lg:text-7xl text-white">
                И КОНЦЕРТЫ В МОСКВЕ
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* ===== UPCOMING EVENTS ===== */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/events" className="inline-flex items-center gap-2 px-6 py-3 btn-outline rounded-xl text-sm font-semibold">
              Все события
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

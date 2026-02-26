"use client";

import Link from "next/link";
import { Event } from "@/lib/data";
import { useState, useCallback, useRef } from "react";
import EventImage from "@/components/EventImage";

export default function EventTimeline({ events }: { events: Event[] }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + events.length) % events.length);
  }, [events.length]);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % events.length);
  }, [events.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  if (events.length === 0) return null;

  const event = events[current];

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-b from-black via-bg-dark to-black relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            БЛИЖАЙШИЕ МЕРОПРИЯТИЯ
          </h2>
          <p className="text-white/50 text-sm sm:text-base mt-2 sm:mt-3">
            Не пропусти самые горячие события
          </p>
        </div>

        {/* Card with swipe */}
        <div
          className="relative group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
            {/* Square image */}
            <div className="relative aspect-square sm:aspect-[4/5] md:aspect-square overflow-hidden">
              <EventImage
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Content overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] sm:text-xs font-bold text-white bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    {event.date}
                  </span>
                  {event.time && (
                    <span className="text-[10px] sm:text-xs font-bold text-white bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      {event.time}
                    </span>
                  )}
                  {event.ageLimit && (
                    <span className="text-[10px] sm:text-xs font-bold text-white bg-white/15 backdrop-blur-sm px-2 py-1 rounded-lg">
                      {event.ageLimit}
                    </span>
                  )}
                </div>

                <h3
                  className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-1 drop-shadow-lg"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {event.title}
                </h3>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-3">
                  <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>{event.venue}</span>
                </div>

                <div className="flex gap-2.5">
                  {!event.isPast && (
                    <Link
                      href={event.ticketLink || event.ticketUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 sm:px-7 py-2.5 bg-white text-black rounded-xl text-xs sm:text-sm font-black tracking-wide touch-manipulation hover:bg-white/90 transition-all active:scale-95"
                    >
                      КУПИТЬ БИЛЕТ
                    </Link>
                  )}
                  <Link
                    href={`/events/${event.id}`}
                    className="px-5 sm:px-7 py-2.5 border border-white/30 text-white rounded-xl text-xs sm:text-sm font-black tracking-wide touch-manipulation hover:bg-white/10 transition-all active:scale-95"
                  >
                    ПОДРОБНЕЕ
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Arrows */}
          {events.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all active:scale-95 z-20"
                aria-label="Предыдущий"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={next}
                className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all active:scale-95 z-20"
                aria-label="Следующий"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {events.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "bg-white w-8 h-2" : "bg-white/20 w-2 h-2 hover:bg-white/40"
                }`}
                aria-label={`Событие ${i + 1}`}
              />
            ))}
            <span className="text-white/30 text-xs font-medium ml-3">{current + 1} / {events.length}</span>
          </div>
        )}
      </div>
    </section>
  );
}

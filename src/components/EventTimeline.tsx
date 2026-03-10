"use client";

import Link from "next/link";
import { Event } from "@/lib/data";
import { useRef } from "react";
import EventImage from "@/components/EventImage";

export default function EventTimeline({ events }: { events: Event[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (events.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
  };

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-b from-black via-bg-dark to-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            БЛИЖАЙШИЕ МЕРОПРИЯТИЯ
          </h2>
        </div>

        <div className="relative">
          {/* Horizontal scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {events.map((event) => (
              <div
                key={event.id}
                className="flex-shrink-0 w-[75vw] sm:w-[320px] snap-start rounded-2xl overflow-hidden border border-white/10 bg-bg-card"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <EventImage
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className="text-[10px] font-bold text-white bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        {event.date}
                      </span>
                      {event.time && (
                        <span className="text-[10px] font-bold text-white bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-md">
                          {event.time}
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-base sm:text-lg font-black text-white leading-tight mb-1 drop-shadow-lg"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-white/70 mb-3">
                      <svg className="w-3 h-3 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="truncate">{event.venue}</span>
                    </div>

                    <div className="flex gap-2">
                      {!event.isPast && (
                        <Link
                          href={event.ticketLink || event.ticketUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white text-black rounded-xl text-xs font-black tracking-wide touch-manipulation hover:bg-white/90 transition-all active:scale-95"
                        >
                          КУПИТЬ БИЛЕТ
                        </Link>
                      )}
                      <Link
                        href={`/events/${event.id}`}
                        className="px-4 py-2 border border-white/30 text-white rounded-xl text-xs font-black tracking-wide touch-manipulation hover:bg-white/10 transition-all active:scale-95"
                      >
                        ПОДРОБНЕЕ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          {events.length > 1 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-black/90 transition-all active:scale-95 z-20 hidden sm:flex"
                aria-label="Назад"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-black/90 transition-all active:scale-95 z-20 hidden sm:flex"
                aria-label="Вперёд"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

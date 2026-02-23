"use client";

import Link from "next/link";
import { Event } from "@/lib/data";
import { useRef } from "react";

export default function EventTimeline({ events }: { events: Event[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-b from-black via-bg-dark to-black relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-6 sm:mb-10">
          <div>
            <h2
              className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              БЛИЖАЙШИЕ МЕРОПРИЯТИЯ
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-2 sm:mt-3">
              Не пропусти самые горячие события
            </p>
          </div>
          
          {/* Навигационные кнопки */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
              aria-label="Предыдущий"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
              aria-label="Следующий"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              className="group relative bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.12] rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] snap-start"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Градиентный бордер при ховере */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  {/* Shimmer эффект */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                      {event.date}
                    </span>
                    {event.ageLimit && (
                      <span className="text-xs sm:text-sm font-bold text-white bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                        {event.ageLimit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-5 relative">
                  <h3
                    className="text-base sm:text-lg font-black text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60 mb-4">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="truncate">{event.venue}</span>
                  </div>

                  <div className="flex gap-2">
                    {!event.isPast && (
                      <Link
                        href={event.ticketLink || event.ticketUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-white to-white/95 text-black rounded-xl text-xs sm:text-sm font-black text-center touch-manipulation hover:shadow-xl hover:shadow-white/20 hover:scale-105 transition-all active:scale-95"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        БИЛЕТ
                      </Link>
                    )}
                    <Link
                      href={`/events/${event.id}`}
                      className={`${event.isPast ? 'flex-1' : 'flex-1'} py-3 sm:py-3.5 border-2 border-white/30 text-white rounded-xl text-xs sm:text-sm font-black text-center touch-manipulation hover:bg-white/10 hover:border-primary/50 transition-all active:scale-95`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      ПОДРОБНЕЕ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

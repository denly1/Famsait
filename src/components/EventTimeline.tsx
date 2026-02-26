"use client";

import Link from "next/link";
import { Event } from "@/lib/data";
import { useState, useCallback } from "react";

export default function EventTimeline({ events }: { events: Event[] }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + events.length) % events.length);
  }, [events.length]);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % events.length);
  }, [events.length]);

  if (events.length === 0) return null;

  const event = events[current];

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-b from-black via-bg-dark to-black relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

        {/* Карточка */}
        <div className="relative group">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
            <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700"
                key={event.id}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
              
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary to-accent px-3 py-1.5 rounded-lg">
                    {event.date}
                  </span>
                  {event.ageLimit && (
                    <span className="text-xs sm:text-sm font-bold text-white bg-white/15 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                      {event.ageLimit}
                    </span>
                  )}
                </div>

                <h3
                  className="text-xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {event.title}
                </h3>

                {event.subtitle && (
                  <p className="text-white/60 text-sm sm:text-base mb-4">{event.subtitle}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-white/60 mb-5">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{event.venue}</span>
                  {event.time && (
                    <>
                      <span className="text-white/30">·</span>
                      <span>{event.time}</span>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  {!event.isPast && (
                    <Link
                      href={event.ticketLink || event.ticketUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 sm:px-8 py-3 bg-white text-black rounded-xl text-sm font-black tracking-wide touch-manipulation hover:bg-white/90 transition-all active:scale-95"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      КУПИТЬ БИЛЕТ
                    </Link>
                  )}
                  <Link
                    href={`/events/${event.id}`}
                    className="px-6 sm:px-8 py-3 border-2 border-white/30 text-white rounded-xl text-sm font-black tracking-wide touch-manipulation hover:bg-white/10 hover:border-white/50 transition-all active:scale-95"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    ПОДРОБНЕЕ
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Стрелки по бокам */}
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

        {/* Точки навигации */}
        {events.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
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

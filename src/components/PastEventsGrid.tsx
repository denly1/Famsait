"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Event } from "@/lib/data";
import EventImage from "@/components/EventImage";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

export default function PastEventsGrid({ events }: { events: Event[] }) {
  const [page, setPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const currentEvents = events.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const goNext = useCallback(() => {
    if (page < totalPages - 1) setPage(p => p + 1);
  }, [page, totalPages]);

  const goPrev = useCallback(() => {
    if (page > 0) setPage(p => p - 1);
  }, [page]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Пока нет прошедших событий</h3>
        <p className="text-text-secondary text-sm">Скоро здесь появятся афиши!</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="grid grid-cols-2 gap-3 sm:gap-4"
      >
        {currentEvents.map((event) => (
          <div
            key={event.id}
            className="group relative cursor-pointer rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
              <EventImage
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs sm:text-sm font-bold truncate" style={{ fontFamily: "var(--font-heading)" }}>
                  {event.title}
                </p>
                <p className="text-white/70 text-[10px] sm:text-xs mt-0.5">{event.date} · {event.venue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goPrev}
            disabled={page === 0}
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/10 hover:border-white/40 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === page
                    ? "bg-primary w-8"
                    : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={page === totalPages - 1}
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/10 hover:border-white/40 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative max-w-lg w-full rounded-3xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#0d0d12" }}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="aspect-[3/4] max-h-[70vh]">
              <EventImage
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5">
              <h3
                className="text-xl sm:text-2xl font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {selectedEvent.title}
              </h3>
              <p className="text-white/60 text-sm mb-4">{selectedEvent.date} · {selectedEvent.venue}</p>
              <Link
                href={`/events/${selectedEvent.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold touch-manipulation hover:bg-white/90 transition-colors active:scale-95"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ПОДРОБНЕЕ
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Event } from "@/lib/data";

export default function PastEventsGallery({ events }: { events: Event[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-black to-bg-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full mb-3 sm:mb-4 inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            АРХИВ
          </span>
          <h2 
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 sm:mb-4 px-4 text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ПРОШЕДШИЕ СОБЫТИЯ
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Посмотри, как это было! Фото и видео с наших легендарных тусовок
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="group relative cursor-pointer"
              onClick={() => setSelectedEvent(event)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                {/* Image */}
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Hover effect - shimmer */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-2.5 py-1 sm:px-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3">
                      {event.date}
                    </span>
                    <h3 
                      className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {event.title}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">{event.venue}</p>
                    
                    {/* View photos button */}
                    <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Смотреть фото
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/past"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 border-2 border-white/30 text-white rounded-full text-xs sm:text-sm font-bold tracking-wide touch-manipulation hover:bg-white/10 hover:border-white/50 transition-all active:scale-95"
          >
            <span>СМОТРЕТЬ ВСЕ ПРОШЕДШИЕ</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Modal for selected event */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-bg-card rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="aspect-video">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6 sm:p-8">
              <h3 
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {selectedEvent.title}
              </h3>
              <p className="text-white/70 text-sm mb-4">{selectedEvent.date} • {selectedEvent.venue}</p>
              <Link
                href={`/events/${selectedEvent.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-black rounded-full text-xs sm:text-sm font-bold touch-manipulation hover:bg-white/90 transition-colors"
              >
                Подробнее о событии
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

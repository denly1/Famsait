"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { events } from "@/lib/data";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const upcoming = events.filter(e => !e.isPast).slice(0, 3);
  
  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % upcoming.length);
  }, [upcoming.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + upcoming.length) % upcoming.length);
  }, [upcoming.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [nextSlide]);

  if (upcoming.length === 0) return null;

  const event = upcoming[currentSlide];

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {upcoming.map((ev, i) => (
        <div
          key={ev.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        </div>
      ))}

      <div className="relative z-10 flex flex-col justify-end min-h-[85vh] sm:min-h-[80vh] pb-6 sm:pb-10 lg:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="flex items-center gap-2 mb-2 sm:mb-3 text-xs sm:text-sm text-white/80 font-medium">
          <span>{event.date}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>{event.venue}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>{event.time}</span>
          {event.ageLimit && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>{event.ageLimit}</span>
            </>
          )}
        </div>

        <h1
          className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-3 sm:mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {event.title}
        </h1>

        <p className="text-white/80 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-lg font-medium">
          {event.subtitle}
        </p>

        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Link
            href={event.ticketLink || event.ticketUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 sm:px-10 sm:py-4 bg-white text-black rounded-full text-sm sm:text-base font-black tracking-wide touch-manipulation hover:bg-white/90 transition-colors active:scale-95 shadow-lg"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            КУПИТЬ БИЛЕТ
          </Link>
          <Link
            href={`/events/${event.id}`}
            className="px-6 py-3 sm:px-10 sm:py-4 border-2 border-white/40 text-white rounded-full text-sm sm:text-base font-black tracking-wide touch-manipulation hover:bg-white/15 hover:border-white/60 transition-all active:scale-95"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ПОДРОБНЕЕ
          </Link>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={prevSlide} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all touch-manipulation active:scale-95"
              aria-label="Предыдущий слайд"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={nextSlide} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all touch-manipulation active:scale-95"
              aria-label="Следующий слайд"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          <div className="flex gap-2">
            {upcoming.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 touch-manipulation ${
                  i === currentSlide ? "bg-white w-8 sm:w-10" : "bg-white/30 w-1.5 sm:w-2 hover:bg-white/50"
                }`}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
          
          <span className="text-white/50 text-xs font-semibold ml-auto sm:ml-2">{currentSlide + 1} / {upcoming.length}</span>
        </div>
      </div>
    </div>
  );
}

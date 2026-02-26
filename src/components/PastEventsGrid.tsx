"use client";

import { useState, useRef, useEffect } from "react";
import EventImage from "@/components/EventImage";

interface PosterItem {
  id: string;
  image: string;
  title?: string;
}

export default function PastEventsGrid({ events }: { events: PosterItem[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [posters, setPosters] = useState<PosterItem[]>(events);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Also load standalone posters from API
  useEffect(() => {
    fetch("/api/past-posters")
      .then(r => r.json())
      .then(data => {
        const extra: PosterItem[] = (data.posters || []).map((p: any) => ({
          id: p.id,
          image: p.image,
          title: p.title || "",
        }));
        setPosters([...events, ...extra]);
      })
      .catch(() => {});
  }, [events]);

  const openModal = (idx: number) => setSelectedIdx(idx);
  const closeModal = () => setSelectedIdx(null);

  const goNextModal = () => {
    if (selectedIdx !== null && selectedIdx < posters.length - 1) setSelectedIdx(selectedIdx + 1);
  };
  const goPrevModal = () => {
    if (selectedIdx !== null && selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
  };

  const handleModalTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleModalTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleModalTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNextModal();
      else goPrevModal();
    }
  };

  // Lock body scroll when modal open + keyboard nav
  useEffect(() => {
    if (selectedIdx === null) return;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNextModal();
      else if (e.key === "ArrowLeft") goPrevModal();
      else if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [selectedIdx, posters.length]);

  if (posters.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Пока нет прошедших событий</h3>
        <p className="text-text-secondary text-sm">Скоро здесь появятся афиши!</p>
      </div>
    );
  }

  return (
    <>
      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {posters.map((poster, idx) => (
          <div
            key={poster.id}
            className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 bg-white/5"
            onClick={() => openModal(idx)}
          >
            <EventImage
              src={poster.image}
              alt={poster.title || "Афиша"}
              className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen photo modal */}
      {selectedIdx !== null && posters[selectedIdx] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-20 text-white/50 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
            {selectedIdx + 1} / {posters.length}
          </div>

          {/* Left arrow */}
          {selectedIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrevModal(); }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right arrow */}
          {selectedIdx < posters.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNextModal(); }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Photo */}
          <div
            className="max-w-[92vw] max-h-[88vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleModalTouchStart}
            onTouchMove={handleModalTouchMove}
            onTouchEnd={handleModalTouchEnd}
          >
            <EventImage
              src={posters[selectedIdx].image}
              alt={posters[selectedIdx].title || "Афиша"}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain select-none"
            />
          </div>
        </div>
      )}
    </>
  );
}

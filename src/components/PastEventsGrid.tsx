"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import EventImage from "@/components/EventImage";

interface PosterItem {
  id: string;
  image: string;
  title?: string;
}

function PhotoModal({
  posters,
  selectedIdx,
  onClose,
  onNext,
  onPrev,
}: {
  posters: PosterItem[];
  selectedIdx: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      if (dx > 0) onNext();
      else onPrev();
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
          touchAction: "manipulation",
        }}
        aria-label="Закрыть"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          color: "rgba(255,255,255,0.5)",
          fontSize: 14,
          fontFamily: "monospace",
        }}
      >
        {selectedIdx + 1} / {posters.length}
      </div>

      {/* Left arrow */}
      {selectedIdx > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
          aria-label="Назад"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {selectedIdx < posters.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
          aria-label="Вперёд"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Photo */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "92vw", maxHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <EventImage
          src={posters[selectedIdx].image}
          alt={posters[selectedIdx].title || "Афиша"}
          className="max-w-full max-h-[85vh] rounded-2xl object-contain select-none"
        />
      </div>
    </div>,
    document.body
  );
}

export default function PastEventsGrid({ events }: { events: PosterItem[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [posters, setPosters] = useState<PosterItem[]>(events);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
  const goNext = () => setSelectedIdx(i => (i !== null && i < posters.length - 1 ? i + 1 : i));
  const goPrev = () => setSelectedIdx(i => (i !== null && i > 0 ? i - 1 : i));

  // Lock body scroll + keyboard nav
  useEffect(() => {
    if (selectedIdx === null) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => { window.removeEventListener("keydown", handler); };
  }, [selectedIdx]);

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
            className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 bg-white/5 active:scale-95"
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

      {/* Modal через portal — рендерится в document.body, выше всего */}
      {mounted && selectedIdx !== null && posters[selectedIdx] && (
        <PhotoModal
          posters={posters}
          selectedIdx={selectedIdx}
          onClose={closeModal}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </>
  );
}

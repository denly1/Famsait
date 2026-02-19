"use client";

import { useState } from "react";

const venues = [
  { id: "atmosphere", name: "ATMOSPHERE", address: "Шмитовский проезд, 32А, стр. 1", type: "концертный зал", capacity: "3.500+", coords: { x: 28, y: 35 } },
  { id: "base", name: "BASE", address: "улица Орджоникидзе 11", type: "концертный зал", capacity: "3.000+", coords: { x: 45, y: 62 } },
  { id: "grafit", name: "ГРАФИТ", address: "электродная улица 2с1", type: "концертный зал", capacity: "2.500+", coords: { x: 58, y: 48 } },
  { id: "arbat-hall", name: "ARBAT HALL", address: "улица новый Арбат 21", type: "концертный зал", capacity: "2.000+", coords: { x: 38, y: 35 } },
  { id: "svoboda", name: "СВОБОДА", address: "Ленинградский проспект 47 с19", type: "концертная площадка", capacity: "1.300+", coords: { x: 35, y: 20 } },
  { id: "urban", name: "URBAN", address: "Большая Новодмитровская улица, 36, стр. 24", type: "концертный зал", capacity: "1.100+", coords: { x: 52, y: 25 } },
  { id: "pravda", name: "PRAVDA", address: "варшавское шоссе 26с12", type: "концертный зал", capacity: "1.100+", coords: { x: 40, y: 75 } },
  { id: "izi", name: "IZI", address: "Басманный переулок, 8с1", type: "клуб", capacity: "1.000+", coords: { x: 55, y: 42 } },
  { id: "anima", name: "ANIMA", address: "сущёвская улица, 21", type: "клуб", capacity: "900+", coords: { x: 45, y: 28 } },
  { id: "vibe", name: "VIBE", address: "бутырская улица 46с1", type: "клуб", capacity: "800+", coords: { x: 42, y: 22 } },
  { id: "castle-hall", name: "CASTLE HALL", address: "вишневая, 13", type: "клуб", capacity: "800+", coords: { x: 22, y: 15 } },
  { id: "pipl", name: "PIPL", address: "комсомольская площадь 6", type: "клуб", capacity: "700", coords: { x: 50, y: 38 } },
];

export default function VenueMap() {
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  
  const displayVenue = venues.find((v) => v.id === (selectedVenue || hoveredVenue));

  return (
    <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="mono-label text-[10px]">ИНТЕРАКТИВНАЯ КАРТА</span>
            <h3 className="font-bold text-base mt-1" style={{ fontFamily: "var(--font-heading)" }}>Наши площадки</h3>
          </div>
          <span className="tag tag-primary">{venues.length} ЛОКАЦИЙ</span>
        </div>

        {/* Map area */}
        <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-xl bg-bg-dark border border-border overflow-hidden mb-4">
          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-40" />
          
          {/* Decorative roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 50 L100 50" stroke="rgba(139,92,246,0.06)" strokeWidth="0.3" />
            <path d="M50 0 L50 100" stroke="rgba(139,92,246,0.06)" strokeWidth="0.3" />
            <path d="M20 0 L80 100" stroke="rgba(139,92,246,0.04)" strokeWidth="0.2" />
            <path d="M80 0 L20 100" stroke="rgba(139,92,246,0.04)" strokeWidth="0.2" />
            <path d="M0 60 Q30 45 50 55 T100 50" stroke="rgba(59,130,246,0.1)" strokeWidth="0.8" fill="none" />
          </svg>

          {/* Center label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted/10 text-[10px] font-bold tracking-[0.3em]" style={{ fontFamily: "var(--font-mono)" }}>
            МОСКВА
          </div>

          {/* Venue pins */}
          {venues.map((venue) => {
            const isHovered = hoveredVenue === venue.id;
            const isSelected = selectedVenue === venue.id;
            const isActive = isHovered || isSelected;
            
            return (
              <button
                key={venue.id}
                onMouseEnter={() => setHoveredVenue(venue.id)}
                onMouseLeave={() => setHoveredVenue(null)}
                onClick={() => setSelectedVenue(selectedVenue === venue.id ? null : venue.id)}
                className={`absolute group transition-all duration-200 -translate-x-1/2 -translate-y-1/2 ${
                  isActive ? "z-20" : "z-10"
                }`}
                style={{ left: `${venue.coords.x}%`, top: `${venue.coords.y}%` }}
              >
                {/* Glow effect */}
                {isActive && (
                  <div className="absolute inset-0 -m-3 rounded-full bg-primary/20 blur-md animate-pulse" />
                )}
                
                {/* Pin dot */}
                <div className={`relative w-3 h-3 rounded-full transition-all duration-200 ${
                  isSelected
                    ? "bg-primary ring-4 ring-primary/30 scale-150"
                    : isHovered
                    ? "bg-primary/80 ring-2 ring-primary/40 scale-125"
                    : "bg-primary/60 hover:bg-primary/80 scale-100"
                }`} />
                
                {/* Hover card */}
                {isHovered && !isSelected && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 backdrop-blur-sm border border-primary/30 rounded-lg whitespace-nowrap animate-fade-in pointer-events-none">
                    <div className="text-[10px] font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                      {venue.name}
                    </div>
                    <div className="text-[9px] text-white/60 mt-0.5">{venue.type}</div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary/30" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected venue details */}
        {displayVenue && (
          <div className="animate-fade-in mb-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-black" style={{ fontFamily: "var(--font-heading)" }}>
                      {displayVenue.name}
                    </h4>
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-md uppercase tracking-wide">
                      {displayVenue.type}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-white/70 text-sm mb-3">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>{displayVenue.address}</span>
                  </div>
                </div>
                {selectedVenue && (
                  <button
                    onClick={() => setSelectedVenue(null)}
                    className="ml-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="px-3 py-1.5 bg-bg-dark/50 rounded-lg">
                  <span className="text-white/50 text-xs">Вместимость:</span>
                  <span className="ml-2 font-bold gradient-text">{displayVenue.capacity}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Venue grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {venues.map((v) => {
            const isSelected = selectedVenue === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVenue(isSelected ? null : v.id)}
                onMouseEnter={() => setHoveredVenue(v.id)}
                onMouseLeave={() => setHoveredVenue(null)}
                className={`text-left p-3 rounded-xl transition-all ${
                  isSelected
                    ? "bg-primary/10 border-2 border-primary/40 shadow-lg shadow-primary/10"
                    : "bg-bg-dark/50 border border-transparent hover:border-primary/20 hover:bg-bg-dark"
                }`}
              >
                <div className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  {v.name}
                </div>
                <div className="text-white/50 text-[10px] uppercase tracking-wide">{v.type}</div>
                <div className="text-primary text-xs font-bold mt-1">{v.capacity}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

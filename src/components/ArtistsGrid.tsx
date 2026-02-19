"use client";

import { useState } from "react";
import Link from "next/link";

const artists = [
  { name: "9MICE", slug: "9mice" },
  { name: "t.A.T.u.", slug: "tatu" },
  { name: "GSPD", slug: "gspd" },
  { name: "ICEGERGERT", slug: "icegergert" },
  { name: "ДОРА", slug: "dora" },
  { name: "TOXI$", slug: "toxis" },
  { name: "MAYOT", slug: "mayot" },
  { name: "163ONMYNECK", slug: "163onmyneck" },
  { name: "ДЖИЗУС", slug: "dzhizus" },
  { name: "BIG BABY TAPE", slug: "bigbabytape" },
  { name: "BEWHY", slug: "bewhy" },
  { name: "ВИНТАЖ", slug: "vintage" },
  { name: "ROCKET", slug: "rocket" },
  { name: "NEWLIGHTCHILD", slug: "newlightchild" },
  { name: "UGLYSTEPHAN", slug: "uglystephan" },
];

export default function ArtistsGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-bg-dark to-black" />
      <div className="glow-orb glow-orb-purple w-[600px] h-[600px] -top-40 -right-40 opacity-10" />
      <div className="glow-orb glow-orb-pink w-[500px] h-[500px] bottom-0 -left-40 opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="bg-white/10 border border-white/10 px-4 py-2 rounded-full mb-3 sm:mb-4 inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            АРТИСТЫ
          </span>
          <h2 
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 sm:mb-4 px-4 text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            КТО ВЫСТУПАЕТ
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Лучшие артисты российской сцены на наших мероприятиях
          </p>
        </div>

        {/* Artists grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          {artists.map((artist, index) => (
            <button
              key={artist.slug}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div 
                className={`
                  relative px-4 py-3 sm:px-6 sm:py-4 rounded-full border-2 transition-all duration-300 ripple
                  ${hoveredIndex === index 
                    ? 'glass border-white text-white scale-105' 
                    : 'glass border-white/10 text-white hover:border-white/30'
                  }
                `}
              >
                <span 
                  className="font-bold text-xs sm:text-sm lg:text-base tracking-wide block text-center"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {artist.name}
                </span>
                
                {/* Animated background gradient */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 animate-pulse -z-10 blur-sm" />
                )}
                
              </div>
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white text-black rounded-full text-xs sm:text-sm font-bold tracking-wide touch-manipulation hover:bg-white/90 transition-colors active:scale-95"
          >
            СМОТРЕТЬ ВСЕ СОБЫТИЯ
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

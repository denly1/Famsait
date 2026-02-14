"use client";

import { useState, useRef, useEffect } from "react";

interface Track {
  title: string;
  artist: string;
  duration: string;
}

const tracks: Track[] = [
  { title: "Neon Dreams", artist: "DJ SMOKE", duration: "3:42" },
  { title: "Midnight Pulse", artist: "VANYA VEGA", duration: "4:15" },
  { title: "Electric Soul", artist: "LERA FOXX", duration: "3:58" },
  { title: "Deep Horizon", artist: "MINIMAL MIKE", duration: "5:20" },
  { title: "Velvet Night", artist: "KATE NOVA", duration: "4:01" },
];

export default function MusicPreview() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (playing !== null) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const cur = prev[playing] || 0;
          if (cur >= 100) {
            setPlaying(null);
            return { ...prev, [playing]: 0 };
          }
          return { ...prev, [playing]: cur + 0.5 };
        });
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const toggle = (i: number) => {
    if (playing === i) {
      setPlaying(null);
    } else {
      setPlaying(i);
      setProgress((prev) => ({ ...prev, [i]: 0 }));
    }
  };

  return (
    <div className="space-y-2">
      {tracks.map((track, i) => (
        <div
          key={i}
          className={`group flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer ${
            playing === i ? "bg-primary/8 border border-primary/15" : "bg-bg-card border border-border hover:border-border-light"
          }`}
          onClick={() => toggle(i)}
        >
          {/* Play/Pause button */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
            playing === i ? "bg-primary/20" : "bg-white/[0.03] group-hover:bg-primary/10"
          }`}>
            {playing === i ? (
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate" style={{ fontFamily: "var(--font-heading)" }}>{track.title}</span>
              {playing === i && (
                <div className="flex gap-[2px] items-end h-3">
                  {[0, 1, 2].map((b) => (
                    <div key={b} className="w-[3px] bg-primary rounded-full animate-bounce" style={{
                      height: `${8 + Math.random() * 6}px`,
                      animationDelay: `${b * 0.15}s`,
                      animationDuration: "0.6s",
                    }} />
                  ))}
                </div>
              )}
            </div>
            <div className="text-text-muted text-xs">{track.artist}</div>
            {/* Progress bar */}
            {playing === i && (
              <div className="mt-1.5 h-[2px] bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${progress[i] || 0}%` }} />
              </div>
            )}
          </div>

          {/* Duration */}
          <span className="mono-label text-xs text-text-muted/50 flex-shrink-0">{track.duration}</span>
        </div>
      ))}
    </div>
  );
}

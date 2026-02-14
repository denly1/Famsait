"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string; // format: DD.MM.YYYY
  label?: string;
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(year, month - 1, day, 20, 0, 0); // assume 20:00 start
}

export default function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = parseDate(targetDate);

    const update = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  const blocks = [
    { value: timeLeft.days, label: "ДНЕЙ" },
    { value: timeLeft.hours, label: "ЧАСОВ" },
    { value: timeLeft.minutes, label: "МИНУТ" },
    { value: timeLeft.seconds, label: "СЕКУНД" },
  ];

  return (
    <div>
      {label && <div className="mono-label text-xs text-center mb-4">{label}</div>}
      <div className="flex items-center justify-center gap-1.5 sm:gap-3">
        {blocks.map((block, i) => (
          <div key={block.label} className="flex items-center gap-1.5 sm:gap-3">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-bg-card border border-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />
                <span className="text-xl sm:text-3xl font-bold relative z-10" style={{ fontFamily: "var(--font-heading)" }}>
                  {String(block.value).padStart(2, "0")}
                </span>
              </div>
              <span className="mono-label text-[7px] sm:text-[9px] mt-1 sm:mt-1.5 text-text-muted/60">{block.label}</span>
            </div>
            {i < blocks.length - 1 && (
              <span className="text-primary/40 text-lg sm:text-xl font-bold mb-5">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

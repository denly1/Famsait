"use client";

import { useEffect, useState, useRef } from "react";

const stats = [
  { value: 200, suffix: "+", label: "Мероприятий проведено" },
  { value: 100000, suffix: "+", label: "Довольных гостей" },
  { value: 15, suffix: "+", label: "Площадок в Москве" },
  { value: 100, suffix: "%", label: "Атмосфера" },
];

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.value / steps;

      const timer = setInterval(() => {
        currentStep++;
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.min(Math.floor(increment * currentStep), stat.value);
          return newCounts;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);
    });
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-black to-bg-dark" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.3)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative inline-block">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
                
                {/* Number */}
                <div className="relative">
                  <span 
                    className="text-3xl sm:text-5xl lg:text-7xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {counts[index].toLocaleString()}
                    {stat.suffix}
                  </span>
                </div>
              </div>
              
              {/* Label */}
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-white/80 font-semibold">
                {stat.label}
              </p>

              {/* Animated underline */}
              <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

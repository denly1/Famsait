import Link from "next/link";
import { Event } from "@/lib/data";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} className="group block">
      <div className="card-hover card-glow rounded-2xl overflow-hidden bg-bg-card border border-border hover:border-border-light transition-all">
        {/* Image */}
        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/40 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-start justify-between">
            <div className="flex gap-1.5">
              <span className="tag tag-primary backdrop-blur-md" style={{ fontSize: "10px", padding: "3px 10px" }}>
                {event.date}
              </span>
              <span className="tag tag-accent backdrop-blur-md" style={{ fontSize: "10px", padding: "3px 10px" }}>
                {event.ageLimit}
              </span>
            </div>
            {!event.isPast && event.price > 0 && (
              <span className="tag tag-white backdrop-blur-md" style={{ fontSize: "10px", padding: "3px 10px" }}>
                от {event.price}{event.currency}
              </span>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pb-0">
            <h3 className="text-lg sm:text-[22px] font-bold tracking-tight leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              {event.title}
            </h3>
            <p className="text-xs text-text-secondary font-medium mt-1 tracking-wide">
              {event.subtitle}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 pt-3 sm:pt-4 space-y-2.5 sm:space-y-3">
          {/* Venue & Time row */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-text-secondary text-[13px]">
              <svg className="w-3.5 h-3.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.venue}</span>
            </div>
            <div className="w-[1px] h-3 bg-border" />
            <div className="flex items-center gap-2 text-text-secondary text-[13px]">
              <svg className="w-3.5 h-3.5 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.time}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-gradient-to-r from-border via-border-light to-border" />

          {/* Lineup preview */}
          <div className="flex flex-wrap gap-1.5">
            {event.lineup.slice(0, 3).map((artist) => (
              <span
                key={artist}
                className="tag tag-primary"
                style={{ fontSize: "10px", padding: "2px 8px" }}
              >
                {artist}
              </span>
            ))}
            {event.lineup.length > 3 && (
              <span
                className="tag tag-white"
                style={{ fontSize: "10px", padding: "2px 8px" }}
              >
                +{event.lineup.length - 3}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="pt-0.5 sm:pt-1 flex items-center justify-between">
            {!event.isPast ? (
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary group-hover:text-primary-light transition-colors">
                Подробнее
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-text-muted group-hover:text-text-primary transition-colors">
                Смотреть фото
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            )}

            {/* Features count */}
            <span className="mono-label text-[10px]">
              {event.features.length} фишек
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

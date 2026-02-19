import Link from "next/link";
import { Event } from "@/lib/data";

export default function EventCard({ event }: { event: Event }) {
  return (
    <article className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-colors w-full">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="text-xs sm:text-sm font-bold text-white bg-black/80 px-3 py-1.5 rounded-lg">
            {event.date}
          </span>
          {event.ageLimit && (
            <span className="text-xs sm:text-sm font-bold text-white bg-black/80 px-2.5 py-1.5 rounded-lg">
              {event.ageLimit}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3
          className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {event.title}
        </h3>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-3 sm:mb-4">
          <span className="truncate">{event.venue}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/30 flex-shrink-0" />
          <span className="flex-shrink-0">{event.time}</span>
        </div>

        <div className="flex gap-2">
          <Link
            href={event.ticketLink || event.ticketUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 sm:py-3.5 bg-white text-black rounded-xl text-xs sm:text-sm font-bold text-center touch-manipulation hover:bg-white/90 transition-colors active:scale-95"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            БИЛЕТ
          </Link>
          <Link
            href={`/events/${event.id}`}
            className="flex-1 py-3 sm:py-3.5 border-2 border-white/30 text-white rounded-xl text-xs sm:text-sm font-bold text-center touch-manipulation hover:bg-white/10 hover:border-white/50 transition-all active:scale-95"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ПОДРОБНЕЕ
          </Link>
        </div>
      </div>
    </article>
  );
}

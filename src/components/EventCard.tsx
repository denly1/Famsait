import Link from "next/link";
import { Event } from "@/lib/data";
import EventImage from "@/components/EventImage";

export default function EventCard({ event }: { event: Event }) {
  return (
    <article className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-colors w-full flex flex-col">
      {/* Image — full poster, no crop */}
      <div className="w-full bg-black">
        <EventImage
          src={event.image}
          alt={event.title}
          className="w-full h-auto block group-hover:opacity-90 transition-opacity duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-white bg-primary/80 px-2 py-0.5 rounded-md">
            {event.date}
          </span>
          {event.time && (
            <span className="text-[10px] font-bold text-white bg-white/15 px-2 py-0.5 rounded-md">
              {event.time}
            </span>
          )}
        </div>

        <h3
          className="text-base sm:text-lg font-bold text-white leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <svg className="w-3 h-3 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="truncate">{event.venue}</span>
        </div>

        <div className="flex gap-2 mt-auto pt-1">
          <Link
            href={event.ticketLink || event.ticketUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-white text-black rounded-xl text-xs sm:text-sm font-bold text-center touch-manipulation hover:bg-white/90 transition-colors active:scale-95"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            КУПИТЬ БИЛЕТ
          </Link>
          <Link
            href={`/events/${event.id}`}
            className="flex-1 py-3 border-2 border-white/30 text-white rounded-xl text-xs sm:text-sm font-bold text-center touch-manipulation hover:bg-white/10 hover:border-white/50 transition-all active:scale-95"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ПОДРОБНЕЕ
          </Link>
        </div>
      </div>
    </article>
  );
}
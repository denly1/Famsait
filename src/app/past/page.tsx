import { mapEventsFromDB } from "@/lib/mappers";
import { query } from "@/lib/db";
import PastEventsGrid from "@/components/PastEventsGrid";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getEvents() {
  try {
    const result = await query("SELECT * FROM events WHERE is_past = true AND (hide_from_past IS NULL OR hide_from_past = false) ORDER BY date DESC");
    return { events: mapEventsFromDB(result.rows || []) };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { events: [] };
  }
}

export default async function PastEventsPage() {
  const { events: pastEvents } = await getEvents();

  return (
    <div className="pt-44 sm:pt-56 pb-16 sm:pb-20 relative">
      <div className="glow-orb glow-orb-pink w-[500px] h-[500px] -top-40 -left-40 opacity-20" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-14 text-center">
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            ПРОШЕДШИЕ СОБЫТИЯ
          </h1>
          <p className="text-text-secondary mt-3 sm:mt-4 max-w-xl mx-auto text-[14px] sm:text-[15px] leading-relaxed">
            Вспомни, как это было! Афиши наших прошедших мероприятий.
          </p>
        </div>

        <PastEventsGrid events={pastEvents} />
      </div>
    </div>
  );
}
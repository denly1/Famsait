import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

async function safeQuery(sql: string, params?: unknown[]) {
  try {
    return await query(sql, params);
  } catch {
    return { rows: [] };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "7d";

  // Ensure table exists
  await safeQuery(`
    CREATE TABLE IF NOT EXISTS page_views (
      id BIGSERIAL PRIMARY KEY,
      path TEXT NOT NULL,
      referrer TEXT,
      user_agent TEXT,
      ip TEXT,
      session_id TEXT,
      event_type TEXT NOT NULL DEFAULT 'pageview',
      meta TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await safeQuery(`CREATE INDEX IF NOT EXISTS idx_pv_created ON page_views (created_at DESC)`);
  await safeQuery(`CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views (session_id)`);

  // Period config
  const periodMap: Record<string, { interval: string; trunc: string; points: number; label: string }> = {
    "1h":  { interval: "1 hour",   trunc: "minute", points: 60,  label: "60 минут" },
    "24h": { interval: "24 hours", trunc: "hour",   points: 24,  label: "24 часа" },
    "7d":  { interval: "7 days",   trunc: "day",    points: 7,   label: "7 дней" },
    "30d": { interval: "30 days",  trunc: "day",    points: 30,  label: "30 дней" },
    "1y":  { interval: "1 year",   trunc: "month",  points: 12,  label: "12 месяцев" },
  };
  const cfg = periodMap[period] || periodMap["7d"];

  // --- Total visitors (unique sessions) in period ---
  const totalVisitorsRes = await safeQuery(`
    SELECT COUNT(DISTINCT session_id) as cnt
    FROM page_views
    WHERE event_type = 'pageview'
      AND created_at >= NOW() - INTERVAL '${cfg.interval}'
  `);
  const totalVisitors = parseInt(totalVisitorsRes.rows[0]?.cnt || "0");

  // --- Total pageviews in period ---
  const totalPageviewsRes = await safeQuery(`
    SELECT COUNT(*) as cnt
    FROM page_views
    WHERE event_type = 'pageview'
      AND created_at >= NOW() - INTERVAL '${cfg.interval}'
  `);
  const totalPageviews = parseInt(totalPageviewsRes.rows[0]?.cnt || "0");

  // --- Today stats ---
  const todayRes = await safeQuery(`
    SELECT 
      COUNT(*) FILTER (WHERE event_type = 'pageview') as pageviews,
      COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'pageview') as visitors
    FROM page_views
    WHERE created_at >= CURRENT_DATE
  `);
  const todayPageviews = parseInt(todayRes.rows[0]?.pageviews || "0");
  const todayVisitors = parseInt(todayRes.rows[0]?.visitors || "0");

  // --- Ticket clicks in period ---
  const ticketClicksRes = await safeQuery(`
    SELECT COUNT(*) as cnt
    FROM page_views
    WHERE event_type = 'ticket_click'
      AND created_at >= NOW() - INTERVAL '${cfg.interval}'
  `);
  const ticketClicks = parseInt(ticketClicksRes.rows[0]?.cnt || "0");

  // --- Total clicks in period ---
  const totalClicksRes = await safeQuery(`
    SELECT COUNT(*) as cnt
    FROM page_views
    WHERE event_type = 'click'
      AND created_at >= NOW() - INTERVAL '${cfg.interval}'
  `);
  const totalClicks = parseInt(totalClicksRes.rows[0]?.cnt || "0");

  // --- Chart data: pageviews grouped by time ---
  const chartRes = await safeQuery(`
    SELECT 
      DATE_TRUNC('${cfg.trunc}', created_at) as t,
      COUNT(*) FILTER (WHERE event_type = 'pageview') as pageviews,
      COUNT(DISTINCT session_id) FILTER (WHERE event_type = 'pageview') as visitors
    FROM page_views
    WHERE created_at >= NOW() - INTERVAL '${cfg.interval}'
    GROUP BY t
    ORDER BY t ASC
  `);
  const chart = chartRes.rows.map((r: any) => ({
    t: r.t,
    pageviews: parseInt(r.pageviews || "0"),
    visitors: parseInt(r.visitors || "0"),
  }));

  // --- Top pages ---
  const topPagesRes = await safeQuery(`
    SELECT path, COUNT(*) as views, COUNT(DISTINCT session_id) as uniq
    FROM page_views
    WHERE event_type = 'pageview'
      AND created_at >= NOW() - INTERVAL '${cfg.interval}'
    GROUP BY path
    ORDER BY views DESC
    LIMIT 10
  `);
  const topPages = topPagesRes.rows.map((r: any) => ({
    path: r.path,
    views: parseInt(r.views || "0"),
    uniq: parseInt(r.uniq || "0"),
  }));

  // --- Hourly distribution (for heatmap — last 7 days) ---
  const hourlyRes = await safeQuery(`
    SELECT EXTRACT(HOUR FROM created_at) as hour, COUNT(*) as cnt
    FROM page_views
    WHERE event_type = 'pageview' AND created_at >= NOW() - INTERVAL '7 days'
    GROUP BY hour ORDER BY hour
  `);
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const row = hourlyRes.rows.find((r: any) => parseInt(r.hour) === i);
    return { hour: i, cnt: parseInt(row?.cnt || "0") };
  });

  // --- Events data ---
  const evRes = await safeQuery(`
    SELECT COUNT(*) as total,
      COUNT(*) FILTER (WHERE is_past = false) as active,
      COUNT(*) FILTER (WHERE is_past = true) as past
    FROM events
  `);
  const totalEvents = parseInt(evRes.rows[0]?.total || "0");
  const activeEvents = parseInt(evRes.rows[0]?.active || "0");
  const pastEventsCount = parseInt(evRes.rows[0]?.past || "0");

  // --- Messages ---
  const msgRes = await safeQuery(`SELECT COUNT(*) as total FROM support_messages`);
  const totalMessages = parseInt(msgRes.rows[0]?.total || "0");

  // --- Popular events (by page views on /events/xxx) ---
  const popularEvRes = await safeQuery(`
    SELECT 
      pv.path,
      COUNT(*) as views,
      e.title
    FROM page_views pv
    LEFT JOIN events e ON pv.path = '/events/' || e.id OR pv.path = '/past/' || e.id
    WHERE pv.event_type = 'pageview'
      AND (pv.path LIKE '/events/%' OR pv.path LIKE '/past/%')
      AND created_at >= NOW() - INTERVAL '${cfg.interval}'
    GROUP BY pv.path, e.title
    ORDER BY views DESC
    LIMIT 5
  `);
  const popularEvents = popularEvRes.rows.map((r: any) => ({
    path: r.path,
    title: r.title || r.path,
    views: parseInt(r.views || "0"),
  }));

  // --- Referrers ---
  const refRes = await safeQuery(`
    SELECT 
      COALESCE(NULLIF(referrer, ''), 'Прямой переход') as source,
      COUNT(*) as cnt
    FROM page_views
    WHERE event_type = 'pageview'
      AND created_at >= NOW() - INTERVAL '${cfg.interval}'
    GROUP BY source
    ORDER BY cnt DESC
    LIMIT 8
  `);
  const referrers = refRes.rows.map((r: any) => ({
    source: r.source,
    cnt: parseInt(r.cnt || "0"),
  }));

  // --- All-time total ---
  const allTimeRes = await safeQuery(`SELECT COUNT(*) as cnt FROM page_views WHERE event_type = 'pageview'`);
  const allTimePageviews = parseInt(allTimeRes.rows[0]?.cnt || "0");

  return NextResponse.json({
    period,
    periodLabel: cfg.label,
    // Summary
    totalVisitors,
    totalPageviews,
    todayPageviews,
    todayVisitors,
    ticketClicks,
    totalClicks,
    allTimePageviews,
    // Events
    totalEvents,
    activeEvents,
    pastEventsCount,
    totalMessages,
    // Charts
    chart,
    topPages,
    hourly,
    popularEvents,
    referrers,
    // Legacy compat
    totalVisits: allTimePageviews,
    todayVisits: todayPageviews,
    totalTicketClicks: ticketClicks,
  });
}
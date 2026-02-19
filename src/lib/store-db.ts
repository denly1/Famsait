import { query } from "./db";
import { Event } from "./data";

// =============================================
// EVENTS
// =============================================

export async function getEvents(): Promise<Event[]> {
  const res = await query(
    `SELECT id, title, subtitle, date, time, venue, address, 
            age_limit AS "ageLimit", price, currency, image, description, 
            lineup, features, is_past AS "isPast", 
            ticket_url AS "ticketUrl", ticket_link AS "ticketLink"
     FROM events ORDER BY date ASC`
  );
  return res.rows;
}

export async function getEventById(id: string): Promise<Event | undefined> {
  const res = await query(
    `SELECT id, title, subtitle, date, time, venue, address, 
            age_limit AS "ageLimit", price, currency, image, description, 
            lineup, features, is_past AS "isPast", 
            ticket_url AS "ticketUrl", ticket_link AS "ticketLink"
     FROM events WHERE id = $1`,
    [id]
  );
  return res.rows[0] || undefined;
}

export async function createEvent(event: Event): Promise<Event> {
  await query(
    `INSERT INTO events (id, title, subtitle, date, time, venue, address, age_limit, price, currency, image, description, lineup, features, is_past, ticket_url, ticket_link)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [
      event.id, event.title, event.subtitle || "", event.date, event.time || "",
      event.venue || "", event.address || "", event.ageLimit || "18+",
      event.price || 0, event.currency || "₽", event.image || "",
      event.description || "", event.lineup || [], event.features || [],
      event.isPast || false, event.ticketUrl || "#", event.ticketLink || "",
    ]
  );
  return event;
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event | null> {
  const existing = await getEventById(id);
  if (!existing) return null;

  const merged = { ...existing, ...data };
  await query(
    `UPDATE events SET title=$2, subtitle=$3, date=$4, time=$5, venue=$6, address=$7, 
     age_limit=$8, price=$9, currency=$10, image=$11, description=$12, 
     lineup=$13, features=$14, is_past=$15, ticket_url=$16, ticket_link=$17
     WHERE id=$1`,
    [
      id, merged.title, merged.subtitle || "", merged.date, merged.time || "",
      merged.venue || "", merged.address || "", merged.ageLimit || "18+",
      merged.price || 0, merged.currency || "₽", merged.image || "",
      merged.description || "", merged.lineup || [], merged.features || [],
      merged.isPast || false, merged.ticketUrl || "#", merged.ticketLink || "",
    ]
  );
  return merged as Event;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const res = await query("DELETE FROM events WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

// =============================================
// MESSAGES
// =============================================

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const res = await query(
    `SELECT id, name, email, subject, message, read, 
            created_at AS "createdAt"
     FROM messages ORDER BY created_at DESC`
  );
  return res.rows;
}

export async function createMessage(msg: { name: string; email: string; subject: string; message: string }): Promise<ContactMessage> {
  const id = `msg-${Date.now()}`;
  const res = await query(
    `INSERT INTO messages (id, name, email, subject, message) 
     VALUES ($1,$2,$3,$4,$5) 
     RETURNING id, name, email, subject, message, read, created_at AS "createdAt"`,
    [id, msg.name, msg.email, msg.subject, msg.message]
  );
  return res.rows[0];
}

export async function markMessageRead(id: string): Promise<boolean> {
  const res = await query("UPDATE messages SET read = TRUE WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const res = await query("DELETE FROM messages WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

// =============================================
// PROMO CODES
// =============================================

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  currentUses: number;
  active: boolean;
  expiresAt: string;
}

export async function getPromoCodes(): Promise<PromoCode[]> {
  const res = await query(
    `SELECT id, code, discount, max_uses AS "maxUses", current_uses AS "currentUses", 
            active, expires_at AS "expiresAt"
     FROM promo_codes ORDER BY created_at DESC`
  );
  return res.rows;
}

export async function validatePromoCode(code: string): Promise<{ valid: boolean; discount: number; message: string }> {
  const res = await query(
    `SELECT id, code, discount, max_uses AS "maxUses", current_uses AS "currentUses", 
            active, expires_at AS "expiresAt"
     FROM promo_codes WHERE UPPER(code) = UPPER($1)`,
    [code]
  );
  if (res.rows.length === 0) return { valid: false, discount: 0, message: "Промокод не найден" };

  const promo = res.rows[0];
  if (!promo.active) return { valid: false, discount: 0, message: "Промокод неактивен" };
  if (new Date(promo.expiresAt) < new Date()) return { valid: false, discount: 0, message: "Промокод истёк" };
  if (promo.currentUses >= promo.maxUses) return { valid: false, discount: 0, message: "Промокод исчерпан" };

  await query("UPDATE promo_codes SET current_uses = current_uses + 1 WHERE id = $1", [promo.id]);
  return { valid: true, discount: promo.discount, message: `Скидка ${promo.discount}% применена!` };
}

export async function createPromoCode(promo: { code: string; discount: number; maxUses: number; active: boolean; expiresAt: string }): Promise<PromoCode> {
  const id = `promo-${Date.now()}`;
  const res = await query(
    `INSERT INTO promo_codes (id, code, discount, max_uses, active, expires_at)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, code, discount, max_uses AS "maxUses", current_uses AS "currentUses", active, expires_at AS "expiresAt"`,
    [id, promo.code, promo.discount, promo.maxUses, promo.active, promo.expiresAt]
  );
  return res.rows[0];
}

export async function deletePromoCode(id: string): Promise<boolean> {
  const res = await query("DELETE FROM promo_codes WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function togglePromoCode(id: string): Promise<PromoCode | null> {
  const res = await query(
    `UPDATE promo_codes SET active = NOT active WHERE id = $1
     RETURNING id, code, discount, max_uses AS "maxUses", current_uses AS "currentUses", active, expires_at AS "expiresAt"`,
    [id]
  );
  return res.rows[0] || null;
}

// =============================================
// SETTINGS
// =============================================

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  telegramUrl: string;
  vkUrl: string;
  instagramUrl: string;
  email: string;
  address: string;
}

export async function getSettings(): Promise<SiteSettings> {
  const res = await query(
    `SELECT site_name AS "siteName", site_description AS "siteDescription",
            telegram_url AS "telegramUrl", vk_url AS "vkUrl", 
            instagram_url AS "instagramUrl", email, address
     FROM site_settings WHERE id = 1`
  );
  if (res.rows.length === 0) {
    return {
      siteName: "THE FAMILY",
      siteDescription: "Лучшие вечеринки и мероприятия в Москве",
      telegramUrl: "https://t.me/familymsk",
      vkUrl: "https://vk.ru/thefamilymskk",
      instagramUrl: "https://www.instagram.com/thefamily_msk",
      email: "tusa2026@mail.ru",
      address: "Москва, Россия",
    };
  }
  return res.rows[0];
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const merged = { ...current, ...data };
  await query(
    `UPDATE site_settings SET 
     site_name=$1, site_description=$2, telegram_url=$3, vk_url=$4, 
     instagram_url=$5, email=$6, address=$7 
     WHERE id = 1`,
    [merged.siteName, merged.siteDescription, merged.telegramUrl, merged.vkUrl, merged.instagramUrl, merged.email, merged.address]
  );
  return merged;
}

// =============================================
// ANALYTICS
// =============================================

export interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  totalTicketClicks: number;
  totalMessages: number;
  popularEvents: { id: string; title: string; views: number }[];
}

export async function getAnalytics(): Promise<AnalyticsData> {
  // Reset daily visits if needed
  await query("SELECT reset_daily_analytics()");

  const [analyticsRes, messagesRes, popularRes] = await Promise.all([
    query("SELECT total_visits, today_visits, total_ticket_clicks FROM analytics WHERE id = 1"),
    query("SELECT COUNT(*) as count FROM messages"),
    query("SELECT event_id AS id, title, views FROM popular_events ORDER BY views DESC LIMIT 10"),
  ]);

  const a = analyticsRes.rows[0] || { total_visits: 0, today_visits: 0, total_ticket_clicks: 0 };
  return {
    totalVisits: a.total_visits,
    todayVisits: a.today_visits,
    totalTicketClicks: a.total_ticket_clicks,
    totalMessages: parseInt(messagesRes.rows[0]?.count || "0"),
    popularEvents: popularRes.rows,
  };
}

export async function trackVisit(): Promise<void> {
  await query("SELECT reset_daily_analytics()");
  await query("UPDATE analytics SET total_visits = total_visits + 1, today_visits = today_visits + 1 WHERE id = 1");
}

export async function trackTicketClick(): Promise<void> {
  await query("UPDATE analytics SET total_ticket_clicks = total_ticket_clicks + 1 WHERE id = 1");
}

// Server-side in-memory store for events, messages, promo codes, etc.
// In production, replace with a real database (PostgreSQL, MongoDB, etc.)

import { Event, faqItems as defaultFaqItems } from "./data";
import { events as defaultEvents } from "./data";

// Deep clone defaults so mutations don't affect the originals
let eventsStore: Event[] = JSON.parse(JSON.stringify(defaultEvents));

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number; // percentage
  maxUses: number;
  currentUses: number;
  active: boolean;
  expiresAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  telegramUrl: string;
  vkUrl: string;
  instagramUrl: string;
  email: string;
  address: string;
}

let messagesStore: ContactMessage[] = [];

let promoCodesStore: PromoCode[] = [
  {
    id: "promo-1",
    code: "FAMILY2026",
    discount: 20,
    maxUses: 100,
    currentUses: 12,
    active: true,
    expiresAt: "2026-12-31",
  },
  {
    id: "promo-2",
    code: "WELCOME",
    discount: 10,
    maxUses: 500,
    currentUses: 45,
    active: true,
    expiresAt: "2026-06-30",
  },
];

let settingsStore: SiteSettings = {
  siteName: "THE FAMILY",
  siteDescription: "Лучшие вечеринки и мероприятия в Москве",
  telegramUrl: "https://t.me/familymsk",
  vkUrl: "https://vk.ru/thefamilymskk",
  instagramUrl: "https://www.instagram.com/thefamily_msk",
  email: "tusa2026@mail.ru",
  address: "Москва, Россия",
};

// Analytics data
export interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  totalTicketClicks: number;
  totalMessages: number;
  popularEvents: { id: string; title: string; views: number }[];
}

let analyticsStore: AnalyticsData = {
  totalVisits: 15420,
  todayVisits: 234,
  totalTicketClicks: 3891,
  totalMessages: 0,
  popularEvents: [
    { id: "neon-nights-feb", title: "NEON NIGHTS", views: 4521 },
    { id: "family-vibes-march", title: "FAMILY VIBES", views: 3210 },
    { id: "underground-session", title: "UNDERGROUND SESSION", views: 2105 },
  ],
};

// === EVENTS ===
export function getEvents(): Event[] {
  return eventsStore;
}

export function getEventById(id: string): Event | undefined {
  return eventsStore.find((e) => e.id === id);
}

export function createEvent(event: Event): Event {
  eventsStore.push(event);
  return event;
}

export function updateEvent(id: string, data: Partial<Event>): Event | null {
  const index = eventsStore.findIndex((e) => e.id === id);
  if (index === -1) return null;
  eventsStore[index] = { ...eventsStore[index], ...data };
  return eventsStore[index];
}

export function deleteEvent(id: string): boolean {
  const len = eventsStore.length;
  eventsStore = eventsStore.filter((e) => e.id !== id);
  return eventsStore.length < len;
}

// === MESSAGES ===
export function getMessages(): ContactMessage[] {
  return messagesStore.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createMessage(msg: Omit<ContactMessage, "id" | "createdAt" | "read">): ContactMessage {
  const newMsg: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messagesStore.push(newMsg);
  analyticsStore.totalMessages = messagesStore.length;
  return newMsg;
}

export function markMessageRead(id: string): boolean {
  const msg = messagesStore.find((m) => m.id === id);
  if (!msg) return false;
  msg.read = true;
  return true;
}

export function deleteMessage(id: string): boolean {
  const len = messagesStore.length;
  messagesStore = messagesStore.filter((m) => m.id !== id);
  analyticsStore.totalMessages = messagesStore.length;
  return messagesStore.length < len;
}

// === PROMO CODES ===
export function getPromoCodes(): PromoCode[] {
  return promoCodesStore;
}

export function validatePromoCode(code: string): { valid: boolean; discount: number; message: string } {
  const promo = promoCodesStore.find((p) => p.code.toUpperCase() === code.toUpperCase());
  if (!promo) return { valid: false, discount: 0, message: "Промокод не найден" };
  if (!promo.active) return { valid: false, discount: 0, message: "Промокод неактивен" };
  if (new Date(promo.expiresAt) < new Date()) return { valid: false, discount: 0, message: "Промокод истёк" };
  if (promo.currentUses >= promo.maxUses) return { valid: false, discount: 0, message: "Промокод исчерпан" };
  promo.currentUses++;
  return { valid: true, discount: promo.discount, message: `Скидка ${promo.discount}% применена!` };
}

export function createPromoCode(promo: Omit<PromoCode, "id" | "currentUses">): PromoCode {
  const newPromo: PromoCode = { ...promo, id: `promo-${Date.now()}`, currentUses: 0 };
  promoCodesStore.push(newPromo);
  return newPromo;
}

export function deletePromoCode(id: string): boolean {
  const len = promoCodesStore.length;
  promoCodesStore = promoCodesStore.filter((p) => p.id !== id);
  return promoCodesStore.length < len;
}

export function togglePromoCode(id: string): PromoCode | null {
  const promo = promoCodesStore.find((p) => p.id === id);
  if (!promo) return null;
  promo.active = !promo.active;
  return promo;
}

// === SETTINGS ===
export function getSettings(): SiteSettings {
  return settingsStore;
}

export function updateSettings(data: Partial<SiteSettings>): SiteSettings {
  settingsStore = { ...settingsStore, ...data };
  return settingsStore;
}

// === ANALYTICS ===
export function getAnalytics(): AnalyticsData {
  return {
    ...analyticsStore,
    totalMessages: messagesStore.length,
  };
}

export function trackVisit() {
  analyticsStore.totalVisits++;
  analyticsStore.todayVisits++;
}

export function trackTicketClick() {
  analyticsStore.totalTicketClicks++;
}

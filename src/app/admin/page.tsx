"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Tab = "dashboard" | "events" | "messages" | "promos" | "settings" | "content" | "venues" | "faq" | "support";

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  totalTicketClicks: number;
  totalMessages: number;
  popularEvents: { id: string; title: string; views: number }[];
}

interface EventData {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  ageLimit: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  lineup: string[];
  features: string[];
  isPast: boolean;
  ticketUrl?: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  currentUses: number;
  active: boolean;
  expiresAt: string;
}

interface Settings {
  siteName: string;
  siteDescription: string;
  telegramUrl: string;
  vkUrl: string;
  instagramUrl: string;
  email: string;
  address: string;
}

interface Venue {
  id: string;
  name: string;
  address: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface HeroContent {
  heading: string;
  subheading: string;
  ctaText: string;
}

interface SupportConversation {
  userId: string;
  messageCount: number;
  lastMessageAt: string;
  unreadCount: number;
}

interface SupportMessage {
  id: string;
  userId: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
  isRead: boolean;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Дашборд", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "events", label: "События", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "venues", label: "Площадки", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
  { id: "content", label: "Контент", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { id: "faq", label: "FAQ", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "support", label: "Поддержка", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { id: "messages", label: "Сообщения", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { id: "promos", label: "Промокоды", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" },
  { id: "settings", label: "Настройки", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

const DEFAULT_VENUES: Venue[] = [
  { id: "arbat-hall", name: "ARBAT HALL", address: "ул. Новый Арбат 21" },
  { id: "izi", name: "IZI", address: "Берсеневская наб. 6 стр 3" },
  { id: "anima", name: "ANIMA", address: "Космодамианская наб. 2" },
  { id: "vibe", name: "VIBE", address: "Рочдельская ул. 15 стр 25" },
  { id: "base", name: "BASE", address: "Пресненская наб. 6 стр 2" },
  { id: "vk-stadium", name: "VK STADIUM", address: "Ленинградский пр-т 31 стр 4" },
  { id: "castle-hall", name: "CASTLE HALL", address: "Ул. Бутырская 62" },
  { id: "pravda", name: "PRAVDA", address: "ул. Правды 24 стр 2" },
  { id: "atmosphere", name: "ATMOSPHERE MOSCOW", address: "Шмитовский проезд 32А, стр 1" },
];

const DEFAULT_FAQ: FAQItem[] = [
  { id: "faq-1", question: "Как купить билет?", answer: "Нажмите кнопку «Купить билет» на странице мероприятия. Принимаем оплату картой и через СБП." },
  { id: "faq-2", question: "Есть ли дресс-код?", answer: "На большинстве мероприятий дресс-код свободный. Для тематических вечеринок указываем рекомендации в описании." },
  { id: "faq-3", question: "Как работают промокоды?", answer: "Введите промокод при покупке билета. Скидка применяется автоматически. Промокоды нельзя суммировать." },
  { id: "faq-4", question: "Возможен ли возврат билета?", answer: "Возврат возможен не позднее чем за 48 часов до начала мероприятия. Напишите нам на почту с номером заказа." },
];

function AdminInput({ label, value, onChange, type = "text", disabled = false, placeholder = "", mono = false }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; disabled?: boolean; placeholder?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-medium tracking-wider text-text-muted/70 uppercase mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none focus:border-primary/30 transition-colors disabled:opacity-40"
        style={mono ? { fontFamily: "var(--font-mono)" } : undefined}
      />
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [eventForm, setEventForm] = useState({
    id: "", title: "", subtitle: "", date: "", time: "", venue: "", address: "",
    ageLimit: "18+", price: 0, currency: "₽", image: "", description: "",
    lineup: "", features: "", isPast: false, ticketUrl: "#",
  });
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoForm, setPromoForm] = useState({ code: "", discount: 10, maxUses: 100, active: true, expiresAt: "2026-12-31" });
  const [toast, setToast] = useState<string | null>(null);
  const [venues, setVenues] = useState<Venue[]>(DEFAULT_VENUES);
  const [venueForm, setVenueForm] = useState({ id: "", name: "", address: "" });
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [faqItems, setFaqItems] = useState<FAQItem[]>(DEFAULT_FAQ);
  const [faqForm, setFaqForm] = useState({ id: "", question: "", answer: "" });
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    heading: "THE FAMILY",
    subheading: "Организуем тусовки, которые ты запомнишь навсегда. Москва. Лучшие площадки. Невероятная атмосфера.",
    ctaText: "БЛИЖАЙШИЕ СОБЫТИЯ",
  });
  const [supportConversations, setSupportConversations] = useState<SupportConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [supportReply, setSupportReply] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, eRes, mRes, pRes, sRes] = await Promise.all([
        fetch("/api/admin/analytics"), fetch("/api/admin/events"), fetch("/api/admin/messages"),
        fetch("/api/admin/promos"), fetch("/api/admin/settings"),
      ]);
      if (aRes.status === 401) { router.push("/admin/login"); return; }
      setAnalytics(await aRes.json()); setEvents(await eRes.json()); setMessages(await mRes.json());
      setPromos(await pRes.json()); setSettings(await sRes.json());
    } catch { showToast("Ошибка загрузки данных"); }
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); };

  const switchTab = (t: Tab) => { setTab(t); setSidebarOpen(false); };

  // === EVENT CRUD ===
  const openNewEvent = () => {
    setEditingEvent(null);
    setEventForm({ id: "", title: "", subtitle: "", date: "", time: "", venue: "", address: "", ageLimit: "18+", price: 0, currency: "₽", image: "", description: "", lineup: "", features: "", isPast: false, ticketUrl: "#" });
    setShowEventForm(true);
  };
  const openEditEvent = (ev: EventData) => {
    setEditingEvent(ev);
    setEventForm({ ...ev, lineup: ev.lineup.join(", "), features: ev.features.join(", "), ticketUrl: ev.ticketUrl || "#" });
    setShowEventForm(true);
  };
  const saveEvent = async () => {
    const payload = { ...eventForm, lineup: eventForm.lineup.split(",").map(s => s.trim()).filter(Boolean), features: eventForm.features.split(",").map(s => s.trim()).filter(Boolean) };
    const res = await fetch("/api/admin/events", { method: editingEvent ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { showToast(editingEvent ? "Событие обновлено" : "Событие создано"); setShowEventForm(false); fetchData(); } else { showToast("Ошибка сохранения"); }
  };
  const removeEvent = async (id: string) => { if (!confirm("Удалить событие?")) return; const res = await fetch("/api/admin/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (res.ok) { showToast("Событие удалено"); fetchData(); } };

  // === MESSAGES ===
  const markRead = async (id: string) => { await fetch("/api/admin/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); fetchData(); };
  const removeMessage = async (id: string) => { await fetch("/api/admin/messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); showToast("Сообщение удалено"); fetchData(); };

  // === PROMOS ===
  const savePromo = async () => { const res = await fetch("/api/admin/promos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(promoForm) }); if (res.ok) { showToast("Промокод создан"); setShowPromoForm(false); fetchData(); } };
  const togglePromo = async (id: string) => { await fetch("/api/admin/promos", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); fetchData(); };
  const removePromo = async (id: string) => { if (!confirm("Удалить промокод?")) return; await fetch("/api/admin/promos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); showToast("Промокод удалён"); fetchData(); };

  // === SETTINGS ===
  const saveSettings = async () => { if (!settings) return; const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) }); if (res.ok) showToast("Настройки сохранены"); };

  // === SUPPORT ===
  const loadSupportConversations = async () => {
    try {
      const res = await fetch("/api/admin/support");
      if (res.ok) {
        const data = await res.json();
        setSupportConversations(data.conversations || []);
      }
    } catch (err) {
      console.error("Error loading support conversations:", err);
    }
  };

  const loadConversationMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/support?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSupportMessages(data.messages || []);
        setSelectedConversation(userId);
      }
    } catch (err) {
      console.error("Error loading conversation messages:", err);
    }
  };

  const sendSupportReply = async () => {
    if (!supportReply.trim() || !selectedConversation) return;
    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedConversation, text: supportReply }),
      });
      if (res.ok) {
        setSupportReply("");
        await loadConversationMessages(selectedConversation);
        await loadSupportConversations();
        showToast("Ответ отправлен");
      }
    } catch (err) {
      console.error("Error sending reply:", err);
      showToast("Ошибка отправки");
    }
  };

  useEffect(() => {
    if (tab === "support") {
      loadSupportConversations();
      const interval = setInterval(loadSupportConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [tab]);

  useEffect(() => {
    if (selectedConversation) {
      const interval = setInterval(() => loadConversationMessages(selectedConversation), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const unreadCount = messages.filter(m => !m.read).length;
  const supportUnreadCount = supportConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[200] animate-fade-in-up">
          <div className="px-5 py-3 rounded-xl bg-primary/15 border border-primary/25 text-sm font-medium backdrop-blur-xl shadow-lg">{toast}</div>
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Familylogo.png" alt="THE FAMILY" className="w-9 h-9 rounded-lg" />
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>THE FAMILY</div>
              <div className="text-[10px] text-text-muted font-medium tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>ADMIN PANEL</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => switchTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${tab === t.id ? "bg-primary/10 text-primary border border-primary/15" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03] border border-transparent"}`}>
              <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={t.icon} /></svg>
              <span className="truncate">{t.label}</span>
              {t.id === "messages" && unreadCount > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0">{unreadCount}</span>}
              {t.id === "support" && supportUnreadCount > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0">{supportUnreadCount}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium text-text-muted hover:text-accent hover:bg-accent/5 transition-all">
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 bg-bg-dark/80 backdrop-blur-xl border-b border-border lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-white/5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
            <span className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{TABS.find(t => t.id === tab)?.label}</span>
            <img src="/Familylogo.png" alt="THE FAMILY" className="w-8 h-8 rounded-lg" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">

          {/* === DASHBOARD === */}
          {tab === "dashboard" && analytics && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Дашборд</h1>
                <p className="text-text-muted text-sm mt-1">Обзор активности сайта</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: "Всего визитов", value: analytics.totalVisits.toLocaleString(), color: "bg-violet-500/10", textColor: "text-violet-400" },
                  { label: "Сегодня", value: analytics.todayVisits.toLocaleString(), color: "bg-blue-500/10", textColor: "text-blue-400" },
                  { label: "Клики билеты", value: analytics.totalTicketClicks.toLocaleString(), color: "bg-rose-500/10", textColor: "text-rose-400" },
                  { label: "Сообщений", value: analytics.totalMessages.toString(), color: "bg-emerald-500/10", textColor: "text-emerald-400" },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl bg-bg-card border border-border p-4 sm:p-5">
                    <span className="text-[10px] font-medium tracking-wider text-text-muted/70 uppercase" style={{ fontFamily: "var(--font-mono)" }}>{s.label}</span>
                    <div className={`text-xl sm:text-2xl font-bold mt-2 ${s.textColor}`} style={{ fontFamily: "var(--font-heading)" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-bg-card border border-border p-4 sm:p-6">
                <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>Популярные события</h3>
                <div className="space-y-2">
                  {analytics.popularEvents.map((ev, i) => (
                    <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-dark/50">
                      <span className="text-text-muted/30 text-xs w-5 text-center" style={{ fontFamily: "var(--font-mono)" }}>0{i + 1}</span>
                      <span className="flex-1 font-medium text-sm truncate">{ev.title}</span>
                      <span className="text-xs text-text-muted flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{ev.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { value: events.filter(e => !e.isPast).length, label: "Активных событий" },
                  { value: promos.filter(p => p.active).length, label: "Активных промокодов" },
                  { value: unreadCount, label: "Непрочитанных" },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl bg-bg-card border border-border p-4 sm:p-5 text-center">
                    <div className="text-2xl sm:text-3xl font-bold gradient-text" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</div>
                    <div className="text-[10px] mt-2 text-text-muted/70 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === EVENTS === */}
          {tab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>События</h1>
                  <p className="text-text-muted text-sm mt-1">{events.length} мероприятий</p>
                </div>
                <button onClick={openNewEvent} className="px-4 sm:px-5 py-2.5 btn-gradient rounded-xl text-[13px] font-semibold tracking-wide flex-shrink-0">
                  <span className="relative z-10 flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="hidden sm:inline">СОЗДАТЬ</span></span>
                </button>
              </div>

              {showEventForm && (
                <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
                  <div className="w-full sm:max-w-2xl min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-y-auto rounded-none sm:rounded-2xl bg-bg-card border-0 sm:border border-border">
                    <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
                    <div className="p-4 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>{editingEvent ? "Редактировать" : "Новое событие"}</h2>
                        <button onClick={() => setShowEventForm(false)} className="p-2 rounded-lg hover:bg-white/5"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <AdminInput label="ID (slug)" value={eventForm.id} onChange={v => setEventForm({...eventForm, id: v})} disabled={!!editingEvent} />
                        <AdminInput label="Название" value={eventForm.title} onChange={v => setEventForm({...eventForm, title: v})} />
                        <AdminInput label="Подзаголовок" value={eventForm.subtitle} onChange={v => setEventForm({...eventForm, subtitle: v})} />
                        <AdminInput label="Дата" value={eventForm.date} onChange={v => setEventForm({...eventForm, date: v})} placeholder="22.02.2026" />
                        <AdminInput label="Время" value={eventForm.time} onChange={v => setEventForm({...eventForm, time: v})} placeholder="20:00 – 04:00" />
                        <AdminInput label="Площадка" value={eventForm.venue} onChange={v => setEventForm({...eventForm, venue: v})} />
                        <AdminInput label="Адрес" value={eventForm.address} onChange={v => setEventForm({...eventForm, address: v})} />
                        <AdminInput label="Возраст" value={eventForm.ageLimit} onChange={v => setEventForm({...eventForm, ageLimit: v})} />
                        <AdminInput label="Цена" value={eventForm.price} onChange={v => setEventForm({...eventForm, price: Number(v)})} type="number" />
                        <AdminInput label="Ссылка на билеты" value={eventForm.ticketUrl} onChange={v => setEventForm({...eventForm, ticketUrl: v})} />
                      </div>
                      <AdminInput label="Изображение (URL)" value={eventForm.image} onChange={v => setEventForm({...eventForm, image: v})} />
                      <div>
                        <label className="block text-[10px] font-medium tracking-wider text-text-muted/70 uppercase mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Описание</label>
                        <textarea value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} rows={3} className="w-full px-3 py-2.5 rounded-xl bg-bg-dark border border-border text-sm resize-none focus:outline-none focus:border-primary/30 transition-colors" />
                      </div>
                      <AdminInput label="Лайнап (через запятую)" value={eventForm.lineup} onChange={v => setEventForm({...eventForm, lineup: v})} placeholder="DJ SMOKE, LERA FOXX" />
                      <AdminInput label="Фишки (через запятую)" value={eventForm.features} onChange={v => setEventForm({...eventForm, features: v})} placeholder="UV ZONE, PHOTO BOOTH" />
                      <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                        <input type="checkbox" checked={eventForm.isPast} onChange={e => setEventForm({...eventForm, isPast: e.target.checked})} className="rounded border-border" />
                        Прошедшее событие
                      </label>
                      <div className="flex gap-3 pt-2">
                        <button onClick={saveEvent} className="flex-1 py-3 btn-gradient rounded-xl text-sm font-semibold"><span className="relative z-10">СОХРАНИТЬ</span></button>
                        <button onClick={() => setShowEventForm(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-white/[0.03] transition-colors">ОТМЕНА</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {events.map(ev => (
                  <div key={ev.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-bg-card border border-border hover:border-border-light transition-all">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 bg-bg-dark">
                      <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm truncate" style={{ fontFamily: "var(--font-heading)" }}>{ev.title}</span>
                        <span className={`inline-flex text-[9px] py-0.5 px-2 rounded-full font-medium ${ev.isPast ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                          {ev.isPast ? "ПРОШЛО" : "АКТИВНО"}
                        </span>
                      </div>
                      <div className="text-text-muted text-xs mt-0.5 truncate">{ev.date} · {ev.venue} · {ev.price}{ev.currency}</div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEditEvent(ev)} className="p-2 rounded-lg hover:bg-white/[0.04] text-text-muted hover:text-primary transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => removeEvent(ev.id)} className="p-2 rounded-lg hover:bg-accent/5 text-text-muted hover:text-accent transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === MESSAGES === */}
          {tab === "messages" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Сообщения</h1>
                <p className="text-text-muted text-sm mt-1">{messages.length} всего · {unreadCount} непрочитанных</p>
              </div>
              {messages.length === 0 ? (
                <div className="text-center py-20 text-text-muted">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <p className="text-sm">Нет сообщений</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map(msg => (
                    <div key={msg.id} className={`rounded-xl bg-bg-card border p-4 sm:p-5 transition-all ${msg.read ? "border-border" : "border-primary/20 bg-primary/[0.02]"}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{msg.name}</span>
                            {!msg.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                            {msg.subject && <span className="text-[9px] py-0.5 px-2 rounded-full bg-primary/10 text-primary font-medium">{msg.subject}</span>}
                          </div>
                          <div className="text-text-muted text-xs mb-2 truncate">{msg.email} · {new Date(msg.createdAt).toLocaleString("ru")}</div>
                          <p className="text-text-secondary text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {!msg.read && (
                            <button onClick={() => markRead(msg.id)} className="p-2 rounded-lg hover:bg-white/[0.04] text-text-muted hover:text-primary transition-all" title="Прочитано">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </button>
                          )}
                          <button onClick={() => removeMessage(msg.id)} className="p-2 rounded-lg hover:bg-accent/5 text-text-muted hover:text-accent transition-all" title="Удалить">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === SUPPORT === */}
          {tab === "support" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Поддержка</h1>
                <p className="text-text-muted text-sm mt-1">{supportConversations.length} диалогов · {supportUnreadCount} непрочитанных</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Conversations list */}
                <div className="lg:col-span-1 space-y-2">
                  {supportConversations.length === 0 ? (
                    <div className="text-center py-12 text-text-muted rounded-xl bg-bg-card border border-border">
                      <svg className="w-10 h-10 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      <p className="text-sm">Нет обращений</p>
                    </div>
                  ) : (
                    supportConversations.map(conv => (
                      <button
                        key={conv.userId}
                        onClick={() => loadConversationMessages(conv.userId)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedConversation === conv.userId
                            ? "bg-primary/10 border-primary/20"
                            : "bg-bg-card border-border hover:border-border-light"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm truncate" style={{ fontFamily: "var(--font-mono)" }}>{conv.userId.substring(0, 20)}...</span>
                          {conv.unreadCount > 0 && <span className="w-5 h-5 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0">{conv.unreadCount}</span>}
                        </div>
                        <div className="text-text-muted text-xs">
                          {conv.messageCount} сообщений · {new Date(conv.lastMessageAt).toLocaleString("ru", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Chat window */}
                <div className="lg:col-span-2 rounded-xl bg-bg-card border border-border overflow-hidden flex flex-col" style={{ height: "600px" }}>
                  {!selectedConversation ? (
                    <div className="flex-1 flex items-center justify-center text-text-muted">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p className="text-sm">Выберите диалог</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="p-4 border-b border-border bg-bg-dark/50">
                        <div className="font-bold text-sm" style={{ fontFamily: "var(--font-mono)" }}>{selectedConversation}</div>
                        <div className="text-text-muted text-xs mt-0.5">{supportMessages.length} сообщений</div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-dark">
                        {supportMessages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                              msg.sender === "user"
                                ? "bg-white/5 text-white/90 border border-white/10"
                                : "bg-gradient-to-br from-primary to-accent text-white"
                            }`}>
                              <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                              <p className="text-[10px] mt-1 opacity-60">
                                {new Date(msg.timestamp).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input */}
                      <div className="p-4 border-t border-border">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={supportReply}
                            onChange={(e) => setSupportReply(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendSupportReply()}
                            placeholder="Напишите ответ..."
                            className="flex-1 bg-bg-dark border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/30 transition-colors"
                          />
                          <button
                            onClick={sendSupportReply}
                            disabled={!supportReply.trim()}
                            className="px-5 py-2.5 btn-gradient rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <span className="relative z-10">ОТПРАВИТЬ</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === PROMOS === */}
          {tab === "promos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Промокоды</h1>
                  <p className="text-text-muted text-sm mt-1">{promos.length} промокодов</p>
                </div>
                <button onClick={() => setShowPromoForm(true)} className="px-4 sm:px-5 py-2.5 btn-gradient rounded-xl text-[13px] font-semibold tracking-wide flex-shrink-0">
                  <span className="relative z-10 flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="hidden sm:inline">СОЗДАТЬ</span></span>
                </button>
              </div>

              {showPromoForm && (
                <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
                  <div className="p-4 sm:p-6 space-y-4">
                    <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Новый промокод</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <AdminInput label="Код" value={promoForm.code} onChange={v => setPromoForm({...promoForm, code: v.toUpperCase()})} mono />
                      <AdminInput label="Скидка %" value={promoForm.discount} onChange={v => setPromoForm({...promoForm, discount: Number(v)})} type="number" />
                      <AdminInput label="Макс. использований" value={promoForm.maxUses} onChange={v => setPromoForm({...promoForm, maxUses: Number(v)})} type="number" />
                      <AdminInput label="Действует до" value={promoForm.expiresAt} onChange={v => setPromoForm({...promoForm, expiresAt: v})} type="date" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={savePromo} className="px-5 py-2.5 btn-gradient rounded-xl text-sm font-semibold"><span className="relative z-10">СОЗДАТЬ</span></button>
                      <button onClick={() => setShowPromoForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-white/[0.03] transition-colors">ОТМЕНА</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {promos.map(p => (
                  <div key={p.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-bg-card border border-border hover:border-border-light transition-all">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${p.active ? "bg-primary/10 text-primary" : "bg-white/[0.03] text-text-muted"}`}>{p.discount}%</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm" style={{ fontFamily: "var(--font-mono)" }}>{p.code}</span>
                        <span className={`text-[9px] py-0.5 px-2 rounded-full font-medium ${p.active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-text-muted"}`}>{p.active ? "АКТИВЕН" : "ВЫКЛЮЧЕН"}</span>
                      </div>
                      <div className="text-text-muted text-xs mt-0.5">{p.currentUses}/{p.maxUses} исп. · до {p.expiresAt}</div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => togglePromo(p.id)} className="p-2 rounded-lg hover:bg-white/[0.04] text-text-muted hover:text-primary transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={p.active ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"} /></svg>
                      </button>
                      <button onClick={() => removePromo(p.id)} className="p-2 rounded-lg hover:bg-accent/5 text-text-muted hover:text-accent transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === VENUES === */}
          {tab === "venues" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Площадки</h1>
                  <p className="text-text-muted text-sm mt-1">{venues.length} площадок</p>
                </div>
                <button onClick={() => { setVenueForm({ id: "", name: "", address: "" }); setShowVenueForm(true); }} className="px-4 sm:px-5 py-2.5 btn-gradient rounded-xl text-[13px] font-semibold tracking-wide flex-shrink-0">
                  <span className="relative z-10 flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="hidden sm:inline">ДОБАВИТЬ</span></span>
                </button>
              </div>

              {showVenueForm && (
                <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
                  <div className="p-4 sm:p-6 space-y-4">
                    <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Новая площадка</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <AdminInput label="Название" value={venueForm.name} onChange={v => setVenueForm({...venueForm, name: v})} placeholder="CLUB NAME" />
                      <AdminInput label="Адрес" value={venueForm.address} onChange={v => setVenueForm({...venueForm, address: v})} placeholder="ул. Примерная 1" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { if (!venueForm.name) return; setVenues([...venues, { id: venueForm.name.toLowerCase().replace(/\s+/g, "-"), name: venueForm.name.toUpperCase(), address: venueForm.address }]); setShowVenueForm(false); showToast("Площадка добавлена"); }} className="px-5 py-2.5 btn-gradient rounded-xl text-sm font-semibold"><span className="relative z-10">ДОБАВИТЬ</span></button>
                      <button onClick={() => setShowVenueForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-white/[0.03] transition-colors">ОТМЕНА</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {venues.map(v => (
                  <div key={v.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-bg-card border border-border hover:border-border-light transition-all">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{v.name}</span>
                      <div className="text-text-muted text-xs mt-0.5 truncate">{v.address}</div>
                    </div>
                    <button onClick={() => { setVenues(venues.filter(x => x.id !== v.id)); showToast("Площадка удалена"); }} className="p-2 rounded-lg hover:bg-accent/5 text-text-muted hover:text-accent transition-all flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === CONTENT (HERO) === */}
          {tab === "content" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Контент сайта</h1>
                <p className="text-text-muted text-sm mt-1">Управление текстами и содержимым</p>
              </div>

              <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
                <div className="p-4 sm:p-6 space-y-4">
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Главная страница (Hero)</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <AdminInput label="Заголовок" value={heroContent.heading} onChange={v => setHeroContent({...heroContent, heading: v})} />
                    <div>
                      <label className="block text-[10px] font-medium tracking-wider text-text-muted/70 uppercase mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Подзаголовок</label>
                      <textarea value={heroContent.subheading} onChange={e => setHeroContent({...heroContent, subheading: e.target.value})} rows={3} className="w-full px-3 py-2.5 rounded-xl bg-bg-dark border border-border text-sm resize-none focus:outline-none focus:border-primary/30 transition-colors" />
                    </div>
                    <AdminInput label="Текст кнопки CTA" value={heroContent.ctaText} onChange={v => setHeroContent({...heroContent, ctaText: v})} />
                  </div>
                  <button onClick={() => showToast("Контент сохранён")} className="px-6 py-3 btn-gradient rounded-xl text-sm font-semibold"><span className="relative z-10">СОХРАНИТЬ</span></button>
                </div>
              </div>

              <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-primary/50 to-accent/50" />
                <div className="p-4 sm:p-6 space-y-4">
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Статистика на главной</h3>
                  <p className="text-text-muted text-xs">Числа, отображаемые в секции статистики</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <AdminInput label="Мероприятий" value="50+" onChange={() => {}} />
                    <AdminInput label="Гостей" value="30K+" onChange={() => {}} />
                    <AdminInput label="Площадок" value="15+" onChange={() => {}} />
                    <AdminInput label="Артистов" value="100+" onChange={() => {}} />
                  </div>
                  <button onClick={() => showToast("Статистика сохранена")} className="px-6 py-3 btn-gradient rounded-xl text-sm font-semibold"><span className="relative z-10">СОХРАНИТЬ</span></button>
                </div>
              </div>

              <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-primary/50 to-accent/50" />
                <div className="p-4 sm:p-6 space-y-4">
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Программа лояльности</h3>
                  <p className="text-text-muted text-xs">Настройки уровней и привилегий</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AdminInput label="Уровень 1 — Название" value="NEWCOMER" onChange={() => {}} />
                    <AdminInput label="Уровень 1 — Скидка %" value="5" onChange={() => {}} />
                    <AdminInput label="Уровень 2 — Название" value="REGULAR" onChange={() => {}} />
                    <AdminInput label="Уровень 2 — Скидка %" value="10" onChange={() => {}} />
                    <AdminInput label="Уровень 3 — Название" value="VIP" onChange={() => {}} />
                    <AdminInput label="Уровень 3 — Скидка %" value="15" onChange={() => {}} />
                    <AdminInput label="Уровень 4 — Название" value="FAMILY" onChange={() => {}} />
                    <AdminInput label="Уровень 4 — Скидка %" value="25" onChange={() => {}} />
                  </div>
                  <button onClick={() => showToast("Лояльность сохранена")} className="px-6 py-3 btn-gradient rounded-xl text-sm font-semibold"><span className="relative z-10">СОХРАНИТЬ</span></button>
                </div>
              </div>
            </div>
          )}

          {/* === FAQ === */}
          {tab === "faq" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>FAQ</h1>
                  <p className="text-text-muted text-sm mt-1">{faqItems.length} вопросов</p>
                </div>
                <button onClick={() => { setEditingFaq(null); setFaqForm({ id: "", question: "", answer: "" }); setShowFaqForm(true); }} className="px-4 sm:px-5 py-2.5 btn-gradient rounded-xl text-[13px] font-semibold tracking-wide flex-shrink-0">
                  <span className="relative z-10 flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="hidden sm:inline">ДОБАВИТЬ</span></span>
                </button>
              </div>

              {showFaqForm && (
                <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
                  <div className="p-4 sm:p-6 space-y-4">
                    <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{editingFaq ? "Редактировать вопрос" : "Новый вопрос"}</h3>
                    <AdminInput label="Вопрос" value={faqForm.question} onChange={v => setFaqForm({...faqForm, question: v})} />
                    <div>
                      <label className="block text-[10px] font-medium tracking-wider text-text-muted/70 uppercase mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Ответ</label>
                      <textarea value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} rows={4} className="w-full px-3 py-2.5 rounded-xl bg-bg-dark border border-border text-sm resize-none focus:outline-none focus:border-primary/30 transition-colors" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => {
                        if (!faqForm.question) return;
                        if (editingFaq) {
                          setFaqItems(faqItems.map(f => f.id === editingFaq.id ? { ...f, question: faqForm.question, answer: faqForm.answer } : f));
                          showToast("Вопрос обновлён");
                        } else {
                          setFaqItems([...faqItems, { id: `faq-${Date.now()}`, question: faqForm.question, answer: faqForm.answer }]);
                          showToast("Вопрос добавлен");
                        }
                        setShowFaqForm(false);
                      }} className="px-5 py-2.5 btn-gradient rounded-xl text-sm font-semibold"><span className="relative z-10">СОХРАНИТЬ</span></button>
                      <button onClick={() => setShowFaqForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-white/[0.03] transition-colors">ОТМЕНА</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {faqItems.map(faq => (
                  <div key={faq.id} className="rounded-xl bg-bg-card border border-border hover:border-border-light transition-all p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{faq.question}</h4>
                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">{faq.answer}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => { setEditingFaq(faq); setFaqForm({ id: faq.id, question: faq.question, answer: faq.answer }); setShowFaqForm(true); }} className="p-2 rounded-lg hover:bg-white/[0.04] text-text-muted hover:text-primary transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => { setFaqItems(faqItems.filter(f => f.id !== faq.id)); showToast("Вопрос удалён"); }} className="p-2 rounded-lg hover:bg-accent/5 text-text-muted hover:text-accent transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === SETTINGS === */}
          {tab === "settings" && settings && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Настройки</h1>
                <p className="text-text-muted text-sm mt-1">Конфигурация сайта</p>
              </div>

              <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
                <div className="p-4 sm:p-6 space-y-5">
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Основные</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AdminInput label="Название сайта" value={settings.siteName} onChange={v => setSettings({...settings, siteName: v})} />
                    <AdminInput label="Описание" value={settings.siteDescription} onChange={v => setSettings({...settings, siteDescription: v})} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-blue-500/50 to-cyan-500/50" />
                <div className="p-4 sm:p-6 space-y-5">
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Соцсети</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AdminInput label="Telegram URL" value={settings.telegramUrl} onChange={v => setSettings({...settings, telegramUrl: v})} placeholder="https://t.me/..." />
                    <AdminInput label="VK URL" value={settings.vkUrl} onChange={v => setSettings({...settings, vkUrl: v})} placeholder="https://vk.ru/..." />
                    <AdminInput label="Instagram URL" value={settings.instagramUrl} onChange={v => setSettings({...settings, instagramUrl: v})} placeholder="https://instagram.com/..." />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-emerald-500/50 to-green-500/50" />
                <div className="p-4 sm:p-6 space-y-5">
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Контакты</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AdminInput label="Email" value={settings.email} onChange={v => setSettings({...settings, email: v})} />
                    <AdminInput label="Адрес" value={settings.address} onChange={v => setSettings({...settings, address: v})} />
                  </div>
                </div>
              </div>

              <button onClick={saveSettings} className="px-8 py-3 btn-gradient rounded-xl text-sm font-semibold"><span className="relative z-10">СОХРАНИТЬ ВСЕ НАСТРОЙКИ</span></button>

              <div className="rounded-2xl bg-bg-card border border-border p-4 sm:p-6">
                <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>Безопасность</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {["JWT Авторизация", "Security Headers", "Rate Limiting", "HttpOnly Cookies", "XSS Protection", "CSRF Protection", "Input Sanitization"].map(label => (
                    <div key={label} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-bg-dark/30 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-text-secondary text-xs flex-1">{label}</span>
                      <span className="text-[9px] py-0.5 px-2 rounded-full bg-emerald-500/10 text-emerald-400 font-medium flex-shrink-0">OK</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

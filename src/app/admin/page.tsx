"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import SupportPanel from "@/components/admin/SupportPanel";

type Tab = "dashboard" | "events" | "past-posters" | "settings" | "faq" | "support";
type Period = "1h" | "24h" | "7d" | "30d" | "1y";

interface ChartPoint { t: string; pageviews: number; visitors: number; }
interface AnalyticsData {
  period: string;
  periodLabel: string;
  totalVisitors: number;
  totalPageviews: number;
  todayPageviews: number;
  todayVisitors: number;
  ticketClicks: number;
  totalClicks: number;
  allTimePageviews: number;
  totalEvents: number;
  activeEvents: number;
  pastEventsCount: number;
  totalMessages: number;
  chart: ChartPoint[];
  topPages: { path: string; views: number; uniq: number }[];
  hourly: { hour: number; cnt: number }[];
  popularEvents: { path: string; title: string; views: number }[];
  referrers: { source: string; cnt: number }[];
  // legacy
  totalVisits: number;
  todayVisits: number;
  totalTicketClicks: number;
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
  isPinned: boolean;
  hideFromPast: boolean;
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
  { id: "past-posters", label: "Прошедшие", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "faq", label: "FAQ", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "support", label: "Поддержка", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { id: "settings", label: "Настройки", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
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
  const [analyticsPeriod, setAnalyticsPeriod] = useState<Period>("7d");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [eventForm, setEventForm] = useState({
    id: "", title: "", subtitle: "", date: "", time: "", venue: "", address: "",
    ageLimit: "18+", price: "", currency: "₽", image: "", description: "",
    lineup: "", features: "", isPast: false, isPinned: false, hideFromPast: false, ticketUrl: "#",
  });
  const [toast, setToast] = useState<string | null>(null);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [faqForm, setFaqForm] = useState({ id: "", question: "", answer: "" });
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [supportConversations, setSupportConversations] = useState<SupportConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [supportReply, setSupportReply] = useState("");
  const [pastPosters, setPastPosters] = useState<{id: string; image: string; title: string; created_at: string}[]>([]);
  const [posterImage, setPosterImage] = useState("");
  const [posterTitle, setPosterTitle] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchAnalytics = useCallback(async (p: Period) => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${p}`);
      if (res.ok) setAnalytics(await res.json());
    } catch {}
    setAnalyticsLoading(false);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, eRes, mRes, sRes, fRes] = await Promise.all([
        fetch(`/api/admin/analytics?period=${analyticsPeriod}`), fetch("/api/admin/events"), fetch("/api/admin/messages"),
        fetch("/api/admin/settings"), fetch("/api/admin/faq"),
      ]);
      if (aRes.status === 401) { router.push("/admin/login"); return; }
      setAnalytics(await aRes.json());
      const rawEvents = await eRes.json();
      setEvents((Array.isArray(rawEvents) ? rawEvents : []).map((e: any) => ({
        id: e.id, title: e.title, subtitle: e.subtitle || "", date: e.date, time: e.time || "",
        venue: e.venue || "", address: e.address || "", ageLimit: e.age_limit || e.ageLimit || "18+",
        price: e.price || 0, currency: e.currency || "₽", image: e.image || "",
        description: e.description || "", lineup: Array.isArray(e.lineup) ? e.lineup : [],
        features: Array.isArray(e.features) ? e.features : [],
        isPast: e.is_past ?? e.isPast ?? false, isPinned: e.is_pinned ?? e.isPinned ?? false, hideFromPast: e.hide_from_past ?? e.hideFromPast ?? false, ticketUrl: e.ticket_url || e.ticketUrl || "#",
      })));
      const rawMsgs = await mRes.json();
      setMessages((Array.isArray(rawMsgs) ? rawMsgs : []).map((m: any) => ({
        id: m.id, name: m.name || "", email: m.email || "", subject: m.subject || "",
        message: m.message || "", createdAt: m.created_at || m.createdAt || "",
        read: m.read ?? false,
      })));
      const rawSettings = await sRes.json();
      setSettings({
        siteName: rawSettings.site_name || rawSettings.siteName || "THE FAMILY",
        siteDescription: rawSettings.site_description || rawSettings.siteDescription || "",
        telegramUrl: rawSettings.telegram_url || rawSettings.telegramUrl || "https://t.me/familymsk",
        vkUrl: rawSettings.vk_url || rawSettings.vkUrl || "https://vk.ru/thefamilymskk",
        instagramUrl: rawSettings.instagram_url || rawSettings.instagramUrl || "https://www.instagram.com/thefamily_msk",
        email: rawSettings.email || "tusa2026@mail.ru",
        address: rawSettings.address || "Москва, Россия",
      });
      const fData = await fRes.json(); setFaqItems(fData.faq || []);
    } catch { showToast("Ошибка загрузки данных"); }
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); };

  const switchTab = (t: Tab) => { setTab(t); setSidebarOpen(false); };

  // === EVENT CRUD ===
  const generateSlug = (title: string) => {
    const translitMap: Record<string, string> = { 'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya' };
    return title.toLowerCase().split('').map(c => translitMap[c] || c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
  };
  const openNewEvent = () => {
    setEditingEvent(null);
    setEventForm({ id: "", title: "", subtitle: "", date: "", time: "", venue: "", address: "", ageLimit: "18+", price: "", currency: "₽", image: "", description: "", lineup: "", features: "", isPast: false, isPinned: false, hideFromPast: false, ticketUrl: "#" });
    setShowEventForm(true);
  };
  const openEditEvent = (ev: EventData) => {
    setEditingEvent(ev);
    setEventForm({ ...ev, price: String(ev.price || ""), lineup: ev.lineup.join(", "), features: ev.features.join(", "), isPinned: ev.isPinned || false, hideFromPast: ev.hideFromPast || false, ticketUrl: ev.ticketUrl || "#" });
    setShowEventForm(true);
  };
  const saveEvent = async () => {
    const autoId = editingEvent ? eventForm.id : (eventForm.id || generateSlug(eventForm.title));
    const payload = { ...eventForm, id: autoId, price: Number(eventForm.price) || 0, lineup: eventForm.lineup.split(",").map(s => s.trim()).filter(Boolean), features: eventForm.features.split(",").map(s => s.trim()).filter(Boolean), isPinned: eventForm.isPinned || false, hideFromPast: eventForm.hideFromPast || false };
    const res = await fetch("/api/admin/events", { method: editingEvent ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { showToast(editingEvent ? "Событие обновлено" : "Событие создано"); setShowEventForm(false); fetchData(); } else { showToast("Ошибка сохранения"); }
  };
  const removeEvent = async (id: string) => { if (!confirm("Удалить событие?")) return; const res = await fetch("/api/admin/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (res.ok) { showToast("Событие удалено"); fetchData(); } };

  // === MESSAGES ===
  const markRead = async (id: string) => { await fetch("/api/admin/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); fetchData(); };
  const removeMessage = async (id: string) => { await fetch("/api/admin/messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); showToast("Сообщение удалено"); fetchData(); };

  // === SETTINGS ===
  const saveSettings = async () => { await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) }); showToast("Настройки сохранены"); fetchData(); };

  // === FAQ ===
  const saveFaq = async () => {
    if (!faqForm.question || !faqForm.answer) return;
    const payload = { ...faqForm, id: faqForm.id || `faq-${Date.now()}` };
    const method = editingFaq ? "PUT" : "POST";
    const res = await fetch("/api/admin/faq", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { showToast(editingFaq ? "Вопрос обновлён" : "Вопрос добавлен"); setShowFaqForm(false); setEditingFaq(null); fetchData(); }
  };
  const removeFaq = async (id: string) => {
    if (!confirm("Удалить вопрос?")) return;
    const res = await fetch("/api/admin/faq", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) { showToast("Вопрос удалён"); fetchData(); }
  };


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

  const loadPastPosters = async () => {
    try {
      const res = await fetch("/api/admin/past-posters");
      if (res.ok) { const data = await res.json(); setPastPosters(data.posters || []); }
    } catch {}
  };
  const savePoster = async () => {
    if (!posterImage) return;
    const res = await fetch("/api/admin/past-posters", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: posterImage, title: posterTitle }) });
    if (res.ok) { showToast("Афиша добавлена"); setPosterImage(""); setPosterTitle(""); loadPastPosters(); }
  };
  const removePoster = async (id: string) => {
    if (!confirm("Удалить афишу?")) return;
    const res = await fetch("/api/admin/past-posters", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) { showToast("Афиша удалена"); loadPastPosters(); }
  };

  useEffect(() => {
    if (tab === "past-posters") loadPastPosters();
  }, [tab]);

  useEffect(() => {
    if (tab === "support") {
      loadSupportConversations();
      const interval = setInterval(loadSupportConversations, 10000);
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
          {tab === "dashboard" && (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Дашборд</h1>
                  <p className="text-text-muted text-sm mt-0.5">Реальная статистика посещаемости</p>
                </div>
                {/* Period switcher */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-bg-card border border-border">
                  {(["1h","24h","7d","30d","1y"] as Period[]).map(p => (
                    <button
                      key={p}
                      onClick={() => { setAnalyticsPeriod(p); fetchAnalytics(p); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${analyticsPeriod === p ? "bg-primary/20 text-primary" : "text-text-muted hover:text-text-primary"}`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {!analytics ? (
                <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <>
                  {/* KPI cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Посетителей", sub: `за ${analytics.periodLabel}`, value: analytics.totalVisitors.toLocaleString(), icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "violet" },
                      { label: "Просмотров", sub: `за ${analytics.periodLabel}`, value: analytics.totalPageviews.toLocaleString(), icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", color: "blue" },
                      { label: "Кликов на билеты", sub: `за ${analytics.periodLabel}`, value: analytics.ticketClicks.toLocaleString(), icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z", color: "emerald" },
                      { label: "Сегодня", sub: `${analytics.todayVisitors} уник.`, value: analytics.todayPageviews.toLocaleString(), icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "amber" },
                    ].map(s => {
                      const colors: Record<string,string> = { violet:"bg-violet-500/10 text-violet-400 border-violet-500/20", blue:"bg-blue-500/10 text-blue-400 border-blue-500/20", emerald:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20", amber:"bg-amber-500/10 text-amber-400 border-amber-500/20" };
                      const [bg, tc, bc] = colors[s.color].split(" ");
                      return (
                        <div key={s.label} className={`rounded-2xl bg-bg-card border border-border p-4 flex flex-col gap-3`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase" style={{ fontFamily: "var(--font-mono)" }}>{s.label}</span>
                            <div className={`w-8 h-8 rounded-lg ${bg} border ${bc} flex items-center justify-center flex-shrink-0`}>
                              <svg className={`w-4 h-4 ${tc}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                            </div>
                          </div>
                          <div>
                            <div className={`text-2xl font-black ${tc}`} style={{ fontFamily: "var(--font-heading)" }}>{s.value}</div>
                            <div className="text-[10px] text-text-muted mt-0.5">{s.sub}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart */}
                  <div className="rounded-2xl bg-bg-card border border-border p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Трафик за {analytics.periodLabel}</h3>
                      <div className="flex items-center gap-4 text-[10px] text-text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-400 rounded inline-block" />просмотры</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-400 rounded inline-block" />посетители</span>
                      </div>
                    </div>
                    {analyticsLoading ? (
                      <div className="h-40 flex items-center justify-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                    ) : analytics.chart.length === 0 ? (
                      <div className="h-40 flex flex-col items-center justify-center text-text-muted text-sm gap-2">
                        <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span>Данных пока нет — статистика накапливается</span>
                      </div>
                    ) : (() => {
                      const W = 600; const H = 120; const pad = 8;
                      const maxPV = Math.max(...analytics.chart.map(d => d.pageviews), 1);
                      const pts = analytics.chart;
                      const xStep = pts.length > 1 ? (W - pad*2) / (pts.length - 1) : 0;
                      const pvPath = pts.map((d,i) => `${i===0?"M":"L"}${pad+i*xStep},${H-pad-(d.pageviews/maxPV)*(H-pad*2)}`).join(" ");
                      const viPath = pts.map((d,i) => `${i===0?"M":"L"}${pad+i*xStep},${H-pad-(d.visitors/maxPV)*(H-pad*2)}`).join(" ");
                      const pvArea = pvPath + ` L${pad+(pts.length-1)*xStep},${H-pad} L${pad},${H-pad} Z`;
                      const formatLabel = (t: string) => {
                        const d = new Date(t);
                        if (analytics.period === "1h") return d.toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"});
                        if (analytics.period === "24h") return d.toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"});
                        if (analytics.period === "1y") return d.toLocaleDateString("ru",{month:"short"});
                        return d.toLocaleDateString("ru",{day:"numeric",month:"short"});
                      };
                      const step = Math.max(1, Math.floor(pts.length / 6));
                      return (
                        <div className="overflow-x-auto">
                          <svg viewBox={`0 0 ${W} ${H+20}`} className="w-full" style={{ minWidth: 300 }}>
                            {/* Grid lines */}
                            {[0,0.25,0.5,0.75,1].map(f => (
                              <line key={f} x1={pad} y1={H-pad-(f)*(H-pad*2)} x2={W-pad} y2={H-pad-(f)*(H-pad*2)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            ))}
                            {/* Area fill */}
                            <path d={pvArea} fill="url(#pvGrad)" opacity="0.3" />
                            {/* Lines */}
                            <path d={pvPath} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinejoin="round" />
                            <path d={viPath} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="4 2" />
                            {/* X labels */}
                            {pts.map((d,i) => i % step === 0 ? (
                              <text key={i} x={pad+i*xStep} y={H+16} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="JetBrains Mono,monospace">{formatLabel(d.t)}</text>
                            ) : null)}
                            <defs>
                              <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a78bfa" />
                                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Bottom row: top pages + hourly + referrers */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Top pages */}
                    <div className="lg:col-span-1 rounded-2xl bg-bg-card border border-border p-4 sm:p-5">
                      <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>Топ страниц</h3>
                      {analytics.topPages.length === 0 ? (
                        <p className="text-text-muted text-xs text-center py-6">Нет данных</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics.topPages.map((p, i) => {
                            const maxV = analytics.topPages[0]?.views || 1;
                            return (
                              <div key={p.path}>
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-[11px] text-text-secondary truncate flex-1 pr-2" title={p.path}>{p.path || "/"}</span>
                                  <span className="text-[10px] text-text-muted flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{p.views}</span>
                                </div>
                                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                  <div className="h-full rounded-full bg-violet-500/60 transition-all" style={{ width: `${(p.views/maxV)*100}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Hourly heatmap */}
                    <div className="lg:col-span-1 rounded-2xl bg-bg-card border border-border p-4 sm:p-5">
                      <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>Активность по часам</h3>
                      <p className="text-[10px] text-text-muted mb-3">за последние 7 дней</p>
                      <div className="grid grid-cols-12 gap-1">
                        {analytics.hourly.map(h => {
                          const maxH = Math.max(...analytics.hourly.map(x => x.cnt), 1);
                          const intensity = h.cnt / maxH;
                          const alpha = Math.round(intensity * 200);
                          return (
                            <div key={h.hour} className="flex flex-col items-center gap-1" title={`${h.hour}:00 — ${h.cnt} посещений`}>
                              <div className="w-full rounded-sm" style={{ height: 32, background: `rgba(167,139,250,${intensity * 0.8 + 0.05})` }} />
                              {h.hour % 6 === 0 && <span className="text-[8px] text-text-muted/50" style={{ fontFamily: "var(--font-mono)" }}>{h.hour}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Referrers */}
                    <div className="lg:col-span-1 rounded-2xl bg-bg-card border border-border p-4 sm:p-5">
                      <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>Источники трафика</h3>
                      {analytics.referrers.length === 0 ? (
                        <p className="text-text-muted text-xs text-center py-6">Нет данных</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics.referrers.map((r, i) => {
                            const maxR = analytics.referrers[0]?.cnt || 1;
                            const colors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-cyan-500","bg-pink-500","bg-orange-500"];
                            const col = colors[i % colors.length];
                            return (
                              <div key={r.source}>
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-[11px] text-text-secondary truncate flex-1 pr-2" title={r.source}>{r.source.length > 30 ? r.source.slice(0,28)+"…" : r.source}</span>
                                  <span className="text-[10px] text-text-muted flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>{r.cnt}</span>
                                </div>
                                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                  <div className={`h-full rounded-full ${col}/60 transition-all`} style={{ width: `${(r.cnt/maxR)*100}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Popular events + site stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Popular events */}
                    <div className="rounded-2xl bg-bg-card border border-border p-4 sm:p-5">
                      <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>Популярные события</h3>
                      {analytics.popularEvents.length === 0 ? (
                        <p className="text-text-muted text-xs text-center py-6">Нет просмотров событий</p>
                      ) : (
                        <div className="space-y-2">
                          {analytics.popularEvents.map((ev, i) => (
                            <div key={ev.path} className="flex items-center gap-3 p-2.5 rounded-xl bg-bg-dark/50">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                              <span className="flex-1 text-xs truncate text-text-secondary">{ev.title}</span>
                              <span className="text-[10px] text-text-muted flex-shrink-0 font-bold" style={{ fontFamily: "var(--font-mono)" }}>{ev.views}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Site-wide totals */}
                    <div className="rounded-2xl bg-bg-card border border-border p-4 sm:p-5">
                      <h3 className="font-bold text-sm mb-3" style={{ fontFamily: "var(--font-heading)" }}>Сайт в цифрах</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Всего просмотров (все время)", value: analytics.allTimePageviews, color: "text-violet-400" },
                          { label: "Активных событий", value: analytics.activeEvents, color: "text-emerald-400" },
                          { label: "Прошедших событий", value: analytics.pastEventsCount, color: "text-text-muted" },
                          { label: "Всего кликов по кнопкам", value: analytics.totalClicks, color: "text-blue-400" },
                          { label: "Кликов на билеты (за период)", value: analytics.ticketClicks, color: "text-amber-400" },
                          { label: "Обращений в поддержку", value: analytics.totalMessages, color: "text-rose-400" },
                        ].map(s => (
                          <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                            <span className="text-xs text-text-muted">{s.label}</span>
                            <span className={`text-sm font-black ${s.color}`} style={{ fontFamily: "var(--font-heading)" }}>{s.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
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
                        <div className="sm:col-span-2"><AdminInput label="Название" value={eventForm.title} onChange={v => setEventForm({...eventForm, title: v})} /></div>
                        <AdminInput label="Подзаголовок" value={eventForm.subtitle} onChange={v => setEventForm({...eventForm, subtitle: v})} />
                        <AdminInput label="Дата" value={eventForm.date} onChange={v => setEventForm({...eventForm, date: v})} placeholder="22.02.2026" />
                        <AdminInput label="Время" value={eventForm.time} onChange={v => setEventForm({...eventForm, time: v})} placeholder="20:00 – 04:00" />
                        <AdminInput label="Площадка" value={eventForm.venue} onChange={v => setEventForm({...eventForm, venue: v})} />
                        <AdminInput label="Адрес" value={eventForm.address} onChange={v => setEventForm({...eventForm, address: v})} />
                        <AdminInput label="Возраст" value={eventForm.ageLimit} onChange={v => setEventForm({...eventForm, ageLimit: v})} />
                        <AdminInput label="Цена" value={eventForm.price} onChange={v => setEventForm({...eventForm, price: v})} placeholder="0" />
                        <AdminInput label="Ссылка на билеты" value={eventForm.ticketUrl} onChange={v => setEventForm({...eventForm, ticketUrl: v})} />
                      </div>
                      <ImageUpload
                        label="Изображение события"
                        currentImage={eventForm.image}
                        onUpload={(url) => setEventForm({...eventForm, image: url})}
                      />
                      <div>
                        <label className="block text-[10px] font-medium tracking-wider text-text-muted/70 uppercase mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Описание</label>
                        <textarea value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} rows={3} className="w-full px-3 py-2.5 rounded-xl bg-bg-dark border border-border text-sm resize-none focus:outline-none focus:border-primary/30 transition-colors" />
                      </div>
                      <AdminInput label="Лайнап (через запятую)" value={eventForm.lineup} onChange={v => setEventForm({...eventForm, lineup: v})} placeholder="DJ SMOKE, LERA FOXX" />
                      <AdminInput label="Фишки (через запятую)" value={eventForm.features} onChange={v => setEventForm({...eventForm, features: v})} placeholder="UV ZONE, PHOTO BOOTH" />
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                          <input type="checkbox" checked={eventForm.isPast} onChange={e => setEventForm({...eventForm, isPast: e.target.checked})} className="rounded border-border" />
                          Прошедшее событие
                        </label>
                        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                          <input type="checkbox" checked={eventForm.isPinned} onChange={e => setEventForm({...eventForm, isPinned: e.target.checked})} className="rounded border-border accent-primary" />
                          <span className="flex items-center gap-1.5">📌 Закрепить на главной странице</span>
                        </label>
                        <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                          <input type="checkbox" checked={eventForm.hideFromPast} onChange={e => setEventForm({...eventForm, hideFromPast: e.target.checked})} className="rounded border-border" />
                          <span className="flex items-center gap-1.5">🙈 Не показывать в разделе «Прошедшие»</span>
                        </label>
                      </div>
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
                        {ev.isPinned && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] py-0.5 px-2 rounded-full font-medium bg-amber-500/15 text-amber-400">📌 ГЛАВНАЯ</span>
                        )}
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

          {/* === PAST POSTERS === */}
          {tab === "past-posters" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Прошедшие мероприятия</h1>
                <p className="text-text-muted text-sm mt-1">Управление прошедшими событиями и афишами</p>
              </div>

              {/* Прошедшие события из БД */}
              {events.filter(e => e.isPast).length > 0 && (
                <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-orange-500/50 to-red-500/50" />
                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                      События помеченные как прошедшие
                      <span className="ml-2 text-xs text-text-muted font-normal">({events.filter(e => e.isPast).length})</span>
                    </h3>
                    <div className="space-y-2">
                      {events.filter(e => e.isPast).map(ev => (
                        <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-dark/50 border border-white/5">
                          {ev.image && (
                            <img src={ev.image} alt={ev.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{ev.title}</div>
                            <div className="text-[11px] text-text-muted">{ev.date}{ev.venue ? ` · ${ev.venue}` : ""}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => { setEditingEvent(ev); setEventForm({ ...ev, price: String(ev.price ?? ""), lineup: Array.isArray(ev.lineup) ? ev.lineup.join(", ") : (ev.lineup || ""), features: Array.isArray(ev.features) ? ev.features.join(", ") : (ev.features || ""), ticketUrl: ev.ticketUrl || "" }); setShowEventForm(true); setTab("events"); }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-text-muted transition-colors"
                            >
                              Изменить
                            </button>
                            <button
                              onClick={() => removeEvent(ev.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-colors"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-text-muted mt-3">«Удалить» — полностью удаляет событие из базы данных. «Изменить» — позволяет снять отметку «прошедшее».</p>
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-rose-500/50 to-pink-500/50" />
                <div className="p-4 sm:p-6 space-y-4">
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Добавить афишу</h3>
                  <ImageUpload
                    label="Фото афиши"
                    currentImage={posterImage}
                    onUpload={(url) => setPosterImage(url)}
                  />
                  <AdminInput label="Название (необязательно)" value={posterTitle} onChange={v => setPosterTitle(v)} placeholder="Например: Вечеринка 22.02" />
                  <button onClick={savePoster} disabled={!posterImage} className="px-6 py-3 btn-gradient rounded-xl text-sm font-semibold disabled:opacity-40">
                    <span className="relative z-10">ДОБАВИТЬ АФИШУ</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pastPosters.map(p => (
                  <div key={p.id} className="relative rounded-xl overflow-hidden border border-border group">
                    <img src={p.image} alt={p.title || "Афиша"} className="w-full h-auto" />
                    <button
                      onClick={() => removePoster(p.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors hover:bg-red-600 active:bg-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    {p.title && <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-2 py-1 text-xs text-white truncate">{p.title}</div>}
                  </div>
                ))}
              </div>

              {pastPosters.length === 0 && (
                <div className="text-center py-12 text-text-muted text-sm">
                  Пока нет загруженных афиш
                </div>
              )}
            </div>
          )}

          {/* === SUPPORT === */}
          {tab === "support" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Поддержка</h1>
                <p className="text-text-muted text-sm mt-1">Диалоги с пользователями</p>
              </div>
              <SupportPanel />
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
                      <button onClick={saveFaq} className="px-5 py-2.5 btn-gradient rounded-xl text-sm font-semibold"><span className="relative z-10">СОХРАНИТЬ</span></button>
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
                        <button onClick={() => removeFaq(faq.id)} className="p-2 rounded-lg hover:bg-accent/5 text-text-muted hover:text-accent transition-all">
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
                <div className="h-[2px] bg-gradient-to-r from-blue-500/50 to-cyan-500/50" />
                <div className="p-4 sm:p-6 space-y-5">
                  <h3 className="font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Соцсети</h3>
                  <p className="text-text-muted text-xs">Ссылки уже заполнены — измените при необходимости</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AdminInput label="Telegram URL" value={settings.telegramUrl || "https://t.me/familymsk"} onChange={v => setSettings({...settings, telegramUrl: v})} placeholder="https://t.me/familymsk" />
                    <AdminInput label="VK URL" value={settings.vkUrl || "https://vk.ru/thefamilymskk"} onChange={v => setSettings({...settings, vkUrl: v})} placeholder="https://vk.ru/thefamilymskk" />
                    <AdminInput label="Instagram URL" value={settings.instagramUrl || "https://www.instagram.com/thefamily_msk"} onChange={v => setSettings({...settings, instagramUrl: v})} placeholder="https://www.instagram.com/thefamily_msk" />
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

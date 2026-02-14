"use client";

import { useState } from "react";

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch {}
    setSending(false);
  };

  const contacts = [
    { icon: "mail", label: "Почта", value: "tusa2026@mail.ru", href: "mailto:tusa2026@mail.ru" },
    { icon: "telegram", label: "Telegram", value: "@familymsk", href: "https://t.me/familymsk" },
    { icon: "vk", label: "ВКонтакте", value: "thefamilymskk", href: "https://vk.ru/thefamilymskk" },
    { icon: "instagram", label: "Instagram", value: "@thefamily_msk", href: "https://www.instagram.com/thefamily_msk" },
    { icon: "location", label: "Город", value: "Москва, Россия", href: undefined },
  ];

  const iconPaths: Record<string, React.ReactNode> = {
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
    location: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></>,
  };

  const socialSvgs: Record<string, React.ReactNode> = {
    telegram: <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
    vk: <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.49 2.27 4.675 2.85 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.624 2.168-3.624.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>,
    instagram: <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  };

  return (
    <div className="pt-20 sm:pt-32 pb-16 sm:pb-20 relative">
      <div className="glow-orb glow-orb-purple w-[500px] h-[500px] -top-40 -right-40 opacity-20" />
      <div className="glow-orb glow-orb-pink w-[400px] h-[400px] bottom-0 -left-40 opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-14">
          <span className="tag tag-primary mb-3 sm:mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            СВЯЗЬ
          </span>
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            КОНТАКТЫ
          </h1>
          <p className="text-text-secondary mt-3 sm:mt-4 max-w-xl text-[14px] sm:text-[15px] leading-relaxed">
            Хочешь стать партнёром, предложить площадку или просто задать вопрос? Мы всегда на связи.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            {contacts.map((contact, i) => (
              <div key={contact.label} className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-bg-card border border-border hover:border-border-light transition-all">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0">
                  {socialSvgs[contact.icon] ? (
                    socialSvgs[contact.icon]
                  ) : (
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {iconPaths[contact.icon]}
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mono-label text-[10px] mb-0.5">{contact.label}</div>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      target={contact.href.startsWith("http") ? "_blank" : undefined}
                      rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-semibold text-[15px] hover:text-primary transition-colors" style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <div className="font-semibold text-[15px]" style={{ fontFamily: "var(--font-heading)" }}>{contact.value}</div>
                  )}
                </div>
                <span className="mono-label text-text-muted/30 text-xs">0{i + 1}</span>
              </div>
            ))}

            {/* Partnership */}
            <div className="relative rounded-2xl overflow-hidden mt-6">
              <div className="absolute inset-0 bg-bg-card" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/3" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

              <div className="relative z-10 p-6">
                <span className="tag tag-primary mb-3 inline-flex">ПАРТНЁРСТВО</span>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "var(--font-heading)" }}>Для партнёров</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  Мы открыты к сотрудничеству с брендами, площадками, артистами и медиа.
                </p>
                <a
                  href="mailto:partners@family-moscow.ru"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-light transition-colors group"
                >
                  partners@family-moscow.ru
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-bg-card border border-border overflow-hidden h-fit">
            <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-5 sm:p-8">
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>Написать нам</h2>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 text-sm font-medium animate-fade-in flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Сообщение отправлено! Мы ответим в ближайшее время.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mono-label text-[10px] mb-2 block">ИМЯ</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none transition-colors"
                    placeholder="Как вас зовут?"
                  />
                </div>
                <div>
                  <label className="mono-label text-[10px] mb-2 block">EMAIL</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="mono-label text-[10px] mb-2 block">ТЕМА</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none transition-colors"
                  >
                    <option value="">Выберите тему</option>
                    <option value="tickets">Вопрос по билетам</option>
                    <option value="partnership">Партнёрство</option>
                    <option value="venue">Предложить площадку</option>
                    <option value="artist">Я артист / DJ</option>
                    <option value="media">Медиа / Пресса</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                <div>
                  <label className="mono-label text-[10px] mb-2 block">СООБЩЕНИЕ</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-bg-dark border border-border text-sm focus:outline-none transition-colors resize-none"
                    placeholder="Расскажите подробнее..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 btn-gradient rounded-xl font-semibold text-[15px] tracking-wide"
                >
                  <span className="relative z-10">ОТПРАВИТЬ</span>
                  <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

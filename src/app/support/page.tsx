export default function SupportPage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-black mb-6" style={{ fontFamily: "var(--font-heading)" }}>
          Поддержка
        </h1>
        
        <div className="bg-bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Онлайн чат</h2>
          <p className="text-text-secondary mb-4">
            Напишите нам в чат, и мы ответим в ближайшее время. Ваши сообщения сохраняются, и вы можете вернуться к диалогу в любое время.
          </p>
          <p className="text-text-muted text-sm">
            💬 Нажмите на иконку чата в правом нижнем углу экрана
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>Другие способы связи</h2>
          <p className="text-text-secondary mb-6">
            Также вы можете связаться с нами через социальные сети или по электронной почте.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <a href="mailto:tusa2026@mail.ru" className="text-primary hover:text-primary-light transition-colors">
                tusa2026@mail.ru
              </a>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Telegram</h3>
              <a href="https://t.me/familymsk" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light transition-colors">
                @familymsk
              </a>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">VK</h3>
              <a href="https://vk.ru/thefamilymskk" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light transition-colors">
                vk.ru/thefamilymskk
              </a>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Instagram</h3>
              <a href="https://www.instagram.com/thefamily_msk" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light transition-colors">
                @thefamily_msk
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

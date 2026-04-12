-- =============================================
-- ПОЛНАЯ УСТАНОВКА БД THE FAMILY EVENTS
-- =============================================
-- Выполни эту команду на сервере:
-- psql -U postgres -d FamSait -f complete_setup.sql
-- =============================================

-- Удаляем старые таблицы если нужно начать с нуля (ОСТОРОЖНО!)
-- DROP TABLE IF EXISTS popular_events CASCADE;
-- DROP TABLE IF EXISTS support_messages CASCADE;
-- DROP TABLE IF EXISTS faq_items CASCADE;
-- DROP TABLE IF EXISTS venues CASCADE;
-- DROP TABLE IF EXISTS promo_codes CASCADE;
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS events CASCADE;
-- DROP TABLE IF EXISTS site_settings CASCADE;
-- DROP TABLE IF EXISTS analytics CASCADE;

-- =============================================
-- ТАБЛИЦЫ
-- =============================================

-- 1. События (мероприятия)
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    subtitle TEXT DEFAULT '',
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) DEFAULT '',
    venue VARCHAR(255) DEFAULT '',
    address VARCHAR(500) DEFAULT '',
    age_limit VARCHAR(20) DEFAULT '18+',
    price INTEGER DEFAULT 0,
    currency VARCHAR(10) DEFAULT '₽',
    image TEXT DEFAULT '',
    description TEXT DEFAULT '',
    lineup TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    is_past BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    hide_from_past BOOLEAN DEFAULT FALSE,
    is_double BOOLEAN DEFAULT FALSE,
    day2_date VARCHAR(50) DEFAULT '',
    day2_time VARCHAR(50) DEFAULT '',
    day2_venue VARCHAR(255) DEFAULT '',
    day2_address VARCHAR(500) DEFAULT '',
    day2_ticket_url TEXT DEFAULT '',
    ticket_url TEXT DEFAULT '#',
    ticket_link TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Контактные сообщения
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) DEFAULT '',
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Промокоды
CREATE TABLE IF NOT EXISTS promo_codes (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    discount INTEGER NOT NULL DEFAULT 0,
    max_uses INTEGER NOT NULL DEFAULT 100,
    current_uses INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    expires_at DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Настройки сайта (одна строка)
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    site_name VARCHAR(255) DEFAULT 'THE FAMILY',
    site_description TEXT DEFAULT 'Лучшие вечеринки и мероприятия в Москве',
    telegram_url TEXT DEFAULT 'https://t.me/familymsk',
    vk_url TEXT DEFAULT 'https://vk.ru/thefamilymskk',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/thefamily_msk',
    email VARCHAR(255) DEFAULT 'tusa2026@mail.ru',
    address TEXT DEFAULT 'Москва, Россия',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Аналитика
CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    total_visits INTEGER DEFAULT 0,
    today_visits INTEGER DEFAULT 0,
    total_ticket_clicks INTEGER DEFAULT 0,
    last_reset_date DATE DEFAULT CURRENT_DATE
);

-- 6. Популярные события (аналитика)
CREATE TABLE IF NOT EXISTS popular_events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    views INTEGER DEFAULT 0
);

-- 7. Площадки
CREATE TABLE IF NOT EXISTS venues (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. FAQ
CREATE TABLE IF NOT EXISTS faq_items (
    id VARCHAR(255) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Поддержка
CREATE TABLE IF NOT EXISTS support_messages (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'support')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- =============================================
-- ИНДЕКСЫ
-- =============================================

CREATE INDEX IF NOT EXISTS idx_events_is_past ON events(is_past);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(active);
CREATE INDEX IF NOT EXISTS idx_support_user_id ON support_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_support_created_at ON support_messages(created_at);

-- =============================================
-- НАЧАЛЬНЫЕ ДАННЫЕ
-- =============================================

-- Настройки сайта
INSERT INTO site_settings (id, site_name, site_description, telegram_url, vk_url, instagram_url, email, address)
VALUES (1, 'THE FAMILY', 'Лучшие вечеринки и мероприятия в Москве', 'https://t.me/familymsk', 'https://vk.ru/thefamilymskk', 'https://www.instagram.com/thefamily_msk', 'tusa2026@mail.ru', 'Москва, Россия')
ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    site_description = EXCLUDED.site_description,
    telegram_url = EXCLUDED.telegram_url,
    vk_url = EXCLUDED.vk_url,
    instagram_url = EXCLUDED.instagram_url,
    email = EXCLUDED.email,
    address = EXCLUDED.address;

-- Аналитика
INSERT INTO analytics (id, total_visits, today_visits, total_ticket_clicks)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Промокоды по умолчанию
INSERT INTO promo_codes (id, code, discount, max_uses, current_uses, active, expires_at)
VALUES 
    ('promo-1', 'FAMILY2026', 20, 100, 0, TRUE, '2026-12-31'),
    ('promo-2', 'WELCOME', 10, 500, 0, TRUE, '2026-06-30')
ON CONFLICT (id) DO UPDATE SET
    discount = EXCLUDED.discount,
    max_uses = EXCLUDED.max_uses,
    active = EXCLUDED.active,
    expires_at = EXCLUDED.expires_at;

-- Площадки по умолчанию
INSERT INTO venues (id, name, address) VALUES
    ('atmosphere', 'ATMOSPHERE', 'Шмитовский проезд, 32А, стр. 1'),
    ('base', 'BASE', 'улица Орджоникидзе 11'),
    ('grafit', 'ГРАФИТ', 'электродная улица 2с1'),
    ('arbat-hall', 'ARBAT HALL', 'улица новый Арбат 21'),
    ('svoboda', 'СВОБОДА', 'Ленинградский проспект 47 с19'),
    ('urban', 'URBAN', 'Большая Новодмитровская улица, 36, стр. 24'),
    ('pravda', 'PRAVDA', 'варшавское шоссе 26с12'),
    ('izi', 'IZI', 'Басманный переулок, 8с1'),
    ('anima', 'ANIMA', 'сущёвская улица, 21'),
    ('vibe', 'VIBE', 'бутырская улица 46с1'),
    ('castle-hall', 'CASTLE HALL', 'вишневая, 13'),
    ('pipl', 'PIPL', 'комсомольская площадь 6')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address;

-- FAQ по умолчанию
INSERT INTO faq_items (id, question, answer, sort_order) VALUES
    ('faq-1', 'Как купить билет?', 'Нажмите кнопку «Купить билет» на странице мероприятия. Принимаем оплату картой и через СБП.', 1),
    ('faq-2', 'Есть ли дресс-код?', 'На большинстве мероприятий дресс-код свободный. Для тематических вечеринок указываем рекомендации в описании.', 2),
    ('faq-3', 'Как работают промокоды?', 'Введите промокод при покупке билета. Скидка применяется автоматически. Промокоды нельзя суммировать.', 3),
    ('faq-4', 'Возможен ли возврат билета?', 'Возврат возможен не позднее чем за 48 часов до начала мероприятия. Напишите нам на почту с номером заказа.', 4)
ON CONFLICT (id) DO UPDATE SET
    question = EXCLUDED.question,
    answer = EXCLUDED.answer,
    sort_order = EXCLUDED.sort_order;

-- =============================================
-- ФУНКЦИИ И ТРИГГЕРЫ
-- =============================================

-- Функция: автообновление updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автообновления updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Функция: сброс дневной аналитики
CREATE OR REPLACE FUNCTION reset_daily_analytics()
RETURNS void AS $$
BEGIN
    UPDATE analytics 
    SET today_visits = 0, last_reset_date = CURRENT_DATE 
    WHERE last_reset_date < CURRENT_DATE;
END;
$$ language 'plpgsql';

-- =============================================
-- ГОТОВО!
-- =============================================
-- База данных настроена и готова к использованию
-- Все таблицы созданы с начальными данными
-- =============================================

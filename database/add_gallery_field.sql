-- Добавляем поле gallery для фотогалереи прошедших событий
ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';

-- Добавляем таблицу для контента сайта
CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    hero_heading VARCHAR(255) DEFAULT 'THE FAMILY',
    hero_subheading TEXT DEFAULT 'Организуем тусовки, которые ты запомнишь навсегда. Москва. Лучшие площадки. Невероятная атмосфера.',
    hero_cta_text VARCHAR(100) DEFAULT 'БЛИЖАЙШИЕ СОБЫТИЯ',
    stats_events VARCHAR(50) DEFAULT '50+',
    stats_guests VARCHAR(50) DEFAULT '30K+',
    stats_venues VARCHAR(50) DEFAULT '15+',
    stats_artists VARCHAR(50) DEFAULT '100+',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставляем начальные данные
INSERT INTO site_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

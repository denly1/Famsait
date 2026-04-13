-- Миграция: добавляем недостающие колонки в таблицу events
-- Запустить на сервере:
-- PGPASSWORD=1 psql -h localhost -U postgres -d FamSait -f database/fix_missing_columns.sql

ALTER TABLE events ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS hide_from_past BOOLEAN DEFAULT FALSE;

-- Сдвоенные мероприятия (2 дня)
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_double BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS day2_date VARCHAR(50) DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS day2_time VARCHAR(50) DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS day2_venue VARCHAR(255) DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS day2_address VARCHAR(500) DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS day2_ticket_url TEXT DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS day2_description TEXT DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS day2_lineup TEXT[] DEFAULT '{}';
ALTER TABLE events ADD COLUMN IF NOT EXISTS day2_features TEXT[] DEFAULT '{}';

-- Проверка
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

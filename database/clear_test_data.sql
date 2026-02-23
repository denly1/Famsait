-- =============================================
-- ОЧИСТКА ТЕСТОВЫХ ДАННЫХ
-- =============================================
-- Этот скрипт удаляет все тестовые данные из БД
-- Оставляет только структуру таблиц и базовые настройки
-- =============================================

-- Удаляем все промокоды
DELETE FROM promo_codes;

-- Удаляем все площадки
DELETE FROM venues;

-- Удаляем все FAQ
DELETE FROM faq_items;

-- Удаляем все события
DELETE FROM events;

-- Удаляем все сообщения
DELETE FROM messages;

-- Удаляем все сообщения поддержки
DELETE FROM support_messages;

-- Удаляем популярные события
DELETE FROM popular_events;

-- Сбрасываем аналитику
UPDATE analytics SET 
    total_visits = 0,
    today_visits = 0,
    total_ticket_clicks = 0,
    last_reset_date = CURRENT_DATE
WHERE id = 1;

-- Оставляем только базовые настройки сайта
UPDATE site_settings SET
    site_name = 'THE FAMILY',
    site_description = 'Лучшие вечеринки и мероприятия в Москве',
    telegram_url = 'https://t.me/familymsk',
    vk_url = 'https://vk.ru/thefamilymskk',
    instagram_url = 'https://www.instagram.com/thefamily_msk',
    email = 'tusa2026@mail.ru',
    address = 'Москва, Россия'
WHERE id = 1;

-- =============================================
-- ГОТОВО!
-- =============================================
-- Все тестовые данные удалены
-- БД готова к работе с реальными данными через админку
-- =============================================

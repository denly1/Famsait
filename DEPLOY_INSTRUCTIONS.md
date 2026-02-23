# 🚀 Инструкция по развертыванию THE FAMILY EVENTS

## 📋 Требования

- Ubuntu Server 24.04 LTS
- Node.js 20.x
- PostgreSQL 16
- PM2 (глобально установлен)
- Nginx (для SSL и reverse proxy)

---

## 1️⃣ Установка PostgreSQL

```bash
# Установка PostgreSQL 16
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# Запуск PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Установка пароля для пользователя postgres
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD '1';
\q
```

---

## 2️⃣ Создание базы данных

```bash
# Создай базу данных FamSait
sudo -u postgres createdb FamSait

# Импортируй схему БД
cd /var/www/family-events
sudo -u postgres psql -d FamSait -f database/complete_setup.sql

# Проверь что таблицы созданы
sudo -u postgres psql -d FamSait -c "\dt"
```

---

## 3️⃣ Настройка PostgreSQL для локального подключения

```bash
# Отредактируй pg_hba.conf
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Найди строки и измени на:
local   all             postgres                                md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5

# Перезапусти PostgreSQL
sudo systemctl restart postgresql

# Проверь подключение
PGPASSWORD=1 psql -h localhost -U postgres -d FamSait -c "SELECT 1;"
```

---

## 4️⃣ Клонирование проекта

```bash
# Клонируй репозиторий
cd /var/www
git clone https://github.com/denly1/Famsait.git family-events
cd family-events

# Установи зависимости
npm install
```

---

## 5️⃣ Настройка переменных окружения

```bash
# Создай .env файл
cat > .env << 'EOF'
# ==============================================
# FAMILY EVENTS - Environment Variables
# ==============================================

# Node Environment
NODE_ENV=production

# PostgreSQL Database Configuration
DB_USER=postgres
DB_PASSWORD=1
DB_HOST=localhost
DB_PORT=5432
DB_NAME=FamSait

# Public Site URL
NEXT_PUBLIC_SITE_URL=https://family-events.ru

# ==============================================
# ВАЖНО: Этот файл содержит пароли!
# Не коммитить в Git! (.gitignore защищает)
# ==============================================
EOF

# Проверь содержимое
cat .env
```

---

## 6️⃣ Сборка проекта

```bash
cd /var/www/family-events
npm run build
```

---

## 7️⃣ Запуск через PM2

```bash
# Останови старый процесс если есть
pm2 delete family-events

# Запусти приложение
pm2 start npm --name "family-events" -- start

# Сохрани конфигурацию
pm2 save

# Настрой автозапуск при перезагрузке
pm2 startup
# Выполни команду которую выдаст pm2 startup

# Проверь статус
pm2 status
pm2 logs family-events --lines 20
```

---

## 8️⃣ Настройка Nginx (если нужно)

```bash
# Создай конфигурацию Nginx
sudo nano /etc/nginx/sites-available/family-events

# Добавь:
server {
    listen 80;
    server_name family-events.ru www.family-events.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Активируй конфигурацию
sudo ln -s /etc/nginx/sites-available/family-events /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Установи SSL через Certbot
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d family-events.ru -d www.family-events.ru
```

---

## 9️⃣ Обновление проекта

```bash
cd /var/www/family-events

# Получи последние изменения
git pull origin master

# Установи новые зависимости (если есть)
npm install

# Пересобери проект
npm run build

# Перезапусти PM2
pm2 restart family-events

# Проверь логи
pm2 logs family-events --lines 30
```

---

## 🔟 Проверка работы

1. **Проверь БД:**
   ```bash
   PGPASSWORD=1 psql -h localhost -U postgres -d FamSait -c "SELECT * FROM site_settings;"
   ```

2. **Проверь API:**
   ```bash
   curl http://localhost:3000/api/settings
   ```

3. **Открой в браузере:**
   - Главная: https://family-events.ru
   - Админка: https://family-events.ru/admin/login
   - Логин: `admin` / Пароль: `family2026`

---

## 🔧 Полезные команды

```bash
# Логи PM2
pm2 logs family-events --lines 50

# Очистить логи
pm2 flush

# Перезапустить приложение
pm2 restart family-events

# Остановить приложение
pm2 stop family-events

# Удалить процесс
pm2 delete family-events

# Проверить статус PostgreSQL
sudo systemctl status postgresql

# Подключиться к БД
PGPASSWORD=1 psql -h localhost -U postgres -d FamSait
```

---

## 🛡️ Безопасность

1. **Смени пароль БД:**
   ```bash
   sudo -u postgres psql
   ALTER USER postgres WITH PASSWORD 'твой_сложный_пароль';
   \q
   
   # Обнови .env файл с новым паролем
   nano /var/www/family-events/.env
   ```

2. **Создай отдельного пользователя БД:**
   ```bash
   sudo -u postgres psql
   CREATE USER familyapp WITH PASSWORD 'сложный_пароль';
   GRANT ALL PRIVILEGES ON DATABASE FamSait TO familyapp;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO familyapp;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO familyapp;
   \q
   
   # Обнови .env
   DB_USER=familyapp
   DB_PASSWORD=сложный_пароль
   ```

3. **Настрой firewall:**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

---

## 📊 Мониторинг

```bash
# Статус всех процессов PM2
pm2 status

# Мониторинг в реальном времени
pm2 monit

# Использование ресурсов
pm2 list
```

---

## 🆘 Решение проблем

### Ошибка подключения к БД

```bash
# Проверь что PostgreSQL запущен
sudo systemctl status postgresql

# Проверь подключение
PGPASSWORD=1 psql -h localhost -U postgres -d FamSait -c "SELECT 1;"

# Проверь логи PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

### Приложение не запускается

```bash
# Проверь логи PM2
pm2 logs family-events --lines 100

# Проверь что .env файл существует
cat /var/www/family-events/.env

# Проверь что проект собран
ls -la /var/www/family-events/.next
```

### 502 Bad Gateway в Nginx

```bash
# Проверь что приложение запущено
pm2 status

# Проверь логи Nginx
sudo tail -f /var/log/nginx/error.log

# Перезапусти Nginx
sudo systemctl restart nginx
```

---

## ✅ Готово!

Проект развернут и готов к использованию! 🎉

#!/bin/sh
# Цей скрипт запускається автоматично при старті контейнера Nginx

echo "Replacing environment variables in built JS files..."

# Шукаємо всі .js файли і замінюємо плейсхолдери на значення з .env файлу сервера
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_API_URL_PLACEHOLDER__|${VITE_API_URL}|g" {} +
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_GOOGLE_CLIENT_ID_PLACEHOLDER__|${VITE_GOOGLE_CLIENT_ID}|g" {} +
find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_STRIPE_PUBLISHABLE_KEY_PLACEHOLDER__|${VITE_STRIPE_PUBLISHABLE_KEY}|g" {} +

echo "All variables have been replaced successfully."
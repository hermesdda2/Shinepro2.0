#!/bin/bash
# deploy.sh — Ejecutar en el VPS después de git pull
# Uso: bash deploy.sh

set -e

echo "📦 Instalando dependencias del backend..."
cd backend
npm ci --omit=dev

echo "🔨 Instalando dependencias del frontend y compilando..."
cd ../frontend
npm ci --legacy-peer-deps
npm run build

echo "📁 Copiando dist → backend/public..."
cd ..
rm -rf backend/public
cp -r frontend/dist backend/public
# Restore hero images from permanent location
HERO_SRC="/home/andresshine/hero-images"
[ -d "$HERO_SRC/Hero Shine Pro 3.0-jpg" ] && cp -r "$HERO_SRC/Hero Shine Pro 3.0-jpg" backend/public/
[ -d "$HERO_SRC/Hero Vertical2.0" ] && cp -r "$HERO_SRC/Hero Vertical2.0" backend/public/

echo "✅ Listo. Inicia el servidor con: cd backend && npm start"

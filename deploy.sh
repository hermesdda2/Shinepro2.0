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
# Preserve hero image folders before wiping public/
mkdir -p /tmp/hero-backup
[ -d backend/public/Hero\ Shine\ Pro\ 3.0-jpg ] && cp -r backend/public/Hero\ Shine\ Pro\ 3.0-jpg /tmp/hero-backup/
[ -d backend/public/Hero\ Vertical2.0 ] && cp -r backend/public/Hero\ Vertical2.0 /tmp/hero-backup/
rm -rf backend/public
cp -r frontend/dist backend/public
# Restore hero images
[ -d /tmp/hero-backup/Hero\ Shine\ Pro\ 3.0-jpg ] && cp -r /tmp/hero-backup/Hero\ Shine\ Pro\ 3.0-jpg backend/public/
[ -d /tmp/hero-backup/Hero\ Vertical2.0 ] && cp -r /tmp/hero-backup/Hero\ Vertical2.0 backend/public/
rm -rf /tmp/hero-backup

echo "✅ Listo. Inicia el servidor con: cd backend && npm start"

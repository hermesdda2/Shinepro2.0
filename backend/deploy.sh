#!/bin/bash
# deploy.sh — Run this on the VPS after git pull
# Usage: bash deploy.sh

set -e

echo "📦 Installing backend dependencies..."
npm ci --omit=dev

echo "🔨 Building frontend..."
cd ../Agendamiento/ShinePro
npm ci
npm run build

echo "📁 Copying dist → backend/public..."
cd ../../Backend
rm -rf public
cp -r ../Agendamiento/ShinePro/dist public

echo "✅ Deploy ready. Run: npm start"

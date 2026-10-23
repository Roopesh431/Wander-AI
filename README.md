# 🌍 WanderAI — AI-Powered Live Tourist Guide

WanderAI shows tourist attractions in any city using **live data**, enriched with
**AI-generated details** — descriptions, entry prices, best time to visit, and
transport options.

![Status](https://img.shields.io/badge/status-in%20development-blue)

## ✨ Features
- 🔍 Search any city → get real tourist attractions (OpenStreetMap live data)
- 🤖 Gemini AI generates place details: history, entry price, tips
- 🚌 Transport options (bus/metro/cab) for every attraction
- 🌦️ Live weather for the city
- ⚡ Smart caching — data auto-refreshes, minimal API calls

## 🛠️ Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | FastAPI (Python) |
| AI | Google Gemini API |
| Live Data | OpenStreetMap, OpenWeatherMap |
| Database | SQLite (cache) |
| Deployment | Render (API) + Vercel (UI) — free tier |

## 🏗️ Architecture
City Search → FastAPI → OpenStreetMap (attractions) → Gemini (details)
                     → OpenWeatherMap (weather) → SQLite cache → React UI

## 🚀 Run Locally
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000/docs

# Frontend
cd frontend
npm install
npm start

📸 Screenshots
Coming soon

Built with ❤️ by Roopesh


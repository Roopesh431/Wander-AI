import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"

CACHE_TTL_SECONDS = 3600  # cache data for 1 hour (auto-refresh)

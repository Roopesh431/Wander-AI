import httpx
from app.config import WEATHER_URL, OPENWEATHER_API_KEY

async def get_weather(city: str) -> dict:
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(WEATHER_URL, params={
            "q": city,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric",
        })
        resp.raise_for_status()
        d = resp.json()

    return {
        "city": d["name"],
        "temp": round(d["main"]["temp"]),
        "feels_like": round(d["main"]["feels_like"]),
        "condition": d["weather"][0]["description"].title(),
        "icon": d["weather"][0]["icon"],
        "humidity": d["main"]["humidity"],
    }

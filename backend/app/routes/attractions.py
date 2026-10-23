from fastapi import APIRouter, HTTPException
from app import cache
from app.config import CACHE_TTL_SECONDS
from app.services import overpass, weather
from app.services.gemini_ai import enrich_attraction

router = APIRouter(prefix="/api", tags=["WanderAI"])
cache.init_db()


@router.get("/attractions/{city}")
async def get_attractions(city: str):
    """Live tourist attractions with AI details (cached 1 hour)."""
    cached = cache.get_cached(f"attractions:{city.lower()}", CACHE_TTL_SECONDS)
    if cached:
        return {"source": "cache", **cached}

    try:
        spots = await overpass.fetch_attractions(city)
        if not spots:
            raise HTTPException(404, f"No attractions found for '{city}'")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(502, "OpenStreetMap service error")

    # AI-enrich top 10 places (keeps cost & speed reasonable)
    enriched = []
    for spot in spots[:10]:
        details = await enrich_attraction(spot["name"], city, spot["type"])
        enriched.append({**spot, "ai": details})

    result = {"city": city, "count": len(enriched), "attractions": enriched}
    cache.set_cached(f"attractions:{city.lower()}", result)
    return {"source": "live", **result}


@router.get("/weather/{city}")
async def get_city_weather(city: str):
    """Live weather for a city (cached 10 min)."""
    cached = cache.get_cached(f"weather:{city.lower()}", 600)
    if cached:
        return {"source": "cache", **cached}

    try:
        w = await weather.get_weather(city)
    except Exception:
        raise HTTPException(502, "Weather service error")

    cache.set_cached(f"weather:{city.lower()}", w)
    return {"source": "live", **w}

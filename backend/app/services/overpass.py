import httpx
from app.config import OVERPASS_URL

QUERY = """
[out:json][timeout:25];
area["name"~"{city}",i]["boundary"="administrative"]->.a;
(node(area.a)["tourism"~"attraction|museum|viewpoint|zoo"];
 way(area.a)["tourism"~"attraction|museum|viewpoint|zoo"];
 rel(area.a)["tourism"~"attraction|museum|viewpoint|zoo"];);
out center 50;
"""

async def fetch_attractions(city: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(OVERPASS_URL, data={"data": QUERY.format(city=city)})
        resp.raise_for_status()
        data = resp.json()

    attractions = []
    for el in data.get("elements", []):
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue
        attractions.append({
            "name": name,
            "type": tags.get("tourism", "attraction"),
            "lat": el.get("lat") or el.get("center", {}).get("lat"),
            "lon": el.get("lon") or el.get("center", {}).get("lon"),
            "website": tags.get("website"),
            "fee": tags.get("fee", "unknown"),
        })
    return attractions

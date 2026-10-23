import json
import google.generativeai as genai
from app.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

_PROMPT = """You are a travel expert. For the tourist attraction "{name}" in {city},
return ONLY valid JSON (no markdown, no extra text) with this structure:
{{
  "description": "2-3 sentence summary of the place and why it's famous",
  "entry_price": "approx entry fee in INR, e.g. 'Free' or '₹50 for adults'",
  "best_time": "best time of day/season to visit",
  "tips": "one practical visitor tip",
  "transport": ["2-3 transport options like bus/metro/cab/auto with rough"]
}}

Place: {name}
City: {city}
Type: {ptype}
"""

async def enrich_attraction(name: str, city: str, ptype: str) -> dict:
    try:
        resp = model.generate_content(_PROMPT.format(name=name, city=city, ptype=ptype))
        text = resp.text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(text)
    except Exception as e:
        return {
            "description": "Details unavailable right now.",
            "entry_price": "unknown",
            "best_time": "unknown",
            "tips": "",
            "transport": [],
            "error": str(e),
        }

import sqlite3
import time
import json

DB_PATH = "wanderai.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS cache (
            key TEXT PRIMARY KEY,
            data TEXT,
            timestamp REAL
        )
    """)
    conn.commit()
    conn.close()

def get_cached(key: str, ttl: int):
    """Return cached data if fresh, else None."""
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute(
        "SELECT data, timestamp FROM cache WHERE key = ?", (key,)
    ).fetchone()
    conn.close()
    if row and (time.time() - row[1]) < ttl:
        return json.loads(row[0])
    return None

def set_cached(key: str, data):
    """Store data in cache."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT OR REPLACE INTO cache (key, data, timestamp) VALUES (?, ?, ?)",
        (key, json.dumps(data), time.time())
    )
    conn.commit()
    conn.close()

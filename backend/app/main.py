from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import attractions

app = FastAPI(
    title="WanderAI API",
    description="AI-Powered Live Tourist Guide",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(attractions.router)


@app.get("/")
def home():
    return {"message": "WanderAI API is running 🌍"}

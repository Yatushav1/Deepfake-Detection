import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from routes.auth import router as auth_router
from routes.sessions import router as session_router
from database import engine
from models import Base


Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="AuthPulse AI",
    description="Authentication session records and rules-based risk assessments",
    version="1.0.0"
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "AUTHPULSE_ALLOWED_ORIGINS",
        "http://127.0.0.1:5173,http://localhost:5173",
    ).split(",")
    if origin.strip()
]
allowed_origins = [
    origin
    if origin.startswith(("http://", "https://"))
    else f"https://{origin}"
    for origin in allowed_origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(auth_router)
app.include_router(session_router)
@app.get("/")
def home():
    return {
        "project": "AuthPulse AI",
        "status": "online",
        "message": "Authentication session records and rules-based risk assessments",
    }

@app.get("/health")
def health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {
        "status": "healthy",
        "database": "connected"
    }
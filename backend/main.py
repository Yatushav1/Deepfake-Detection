import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.sessions import router as session_router

from database import engine
from models import Base



# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AuthPulse AI",
    description="Identity Threat Detection & Response System",
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
        "message": "Identity Threat Detection & Response System"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected"
    }
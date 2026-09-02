from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)


class UserSession(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)

    ip_address = Column(String)
    device = Column(String)
    browser = Column(String)
    location = Column(String)

    risk_score = Column(Float, default=0)
    status = Column(String, default="ACTIVE")

    created_at = Column(DateTime, default=datetime.utcnow)


class Threat(Base):
    __tablename__ = "threats"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)
    session_id = Column(Integer)

    threat_type = Column(String)
    severity = Column(String)

    risk_score = Column(Float)

    description = Column(String)

    resolved = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
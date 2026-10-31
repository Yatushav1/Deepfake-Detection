from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict, Field
from typing import Annotated

from database import get_db
from ai.risk_model import (
    MODEL_NAME,
    MODEL_NOTICE,
    predict_suspicious_probability,
    prediction_reasons,
)
from models import User, UserSession
from routes.auth import get_current_user


router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"]
)


@router.get("")
def list_sessions(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> list[dict[str, object]]:
    user_sessions = (
        db.query(UserSession)
        .filter(UserSession.user_id == current_user.id)
        .order_by(UserSession.created_at.desc(), UserSession.id.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "session_id": session.id,
            "ip_address": session.ip_address,
            "device": session.device,
            "browser": session.browser,
            "location": session.location,
            "risk_score": session.risk_score,
            "status": session.status,
            "created_at": session.created_at.isoformat(),
        }
        for session in user_sessions
    ]


class SessionRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, allow_inf_nan=False)

    ip_address: str = Field(min_length=1, max_length=64)
    device: str = Field(min_length=1, max_length=120)
    browser: str = Field(min_length=1, max_length=120)
    location: str = Field(min_length=1, max_length=120)

    failed_attempts: int = Field(default=0, ge=0)
    new_device: bool = False
    location_change: bool = False
    impossible_travel: bool = False
    unusual_time: bool = False
    deepfake_score: float = Field(default=0.0, ge=0.0, le=1.0)


def calculate_risk(
    data: SessionRequest,
) -> tuple[int, str, str, list[str], float]:
    suspicious_probability = predict_suspicious_probability(data)
    risk = round(suspicious_probability * 100)
    reasons = prediction_reasons(data)

    if risk <= 30:
        level = "LOW"
        status = "ALLOW"

    elif risk <= 60:
        level = "MEDIUM"
        status = "MONITOR"

    elif risk <= 80:
        level = "HIGH"
        status = "STEP_UP_AUTH"

    else:
        level = "CRITICAL"
        status = "BLOCK"

    return risk, level, status, reasons, suspicious_probability


@router.post("/create")
def create_session(
    data: SessionRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict[str, object]:
    risk, level, action, reasons, suspicious_probability = calculate_risk(data)
    prediction = "SUSPICIOUS" if suspicious_probability >= 0.5 else "NORMAL"
    confidence = round(max(suspicious_probability, 1 - suspicious_probability) * 100)

    session = UserSession(
        user_id=current_user.id,
        ip_address=data.ip_address,
        device=data.device,
        browser=data.browser,
        location=data.location,
        risk_score=risk,
        status=action
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "session_id": session.id,
        "risk_score": risk,
        "risk_level": level,
        "recommended_action": action,
        "prediction": prediction,
        "suspicious_probability": round(suspicious_probability * 100, 1),
        "confidence": confidence,
        "model_name": MODEL_NAME,
        "model_notice": MODEL_NOTICE,
        "reasons": reasons,
    }
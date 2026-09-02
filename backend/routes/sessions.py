from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import UserSession


router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"]
)


class SessionRequest(BaseModel):
    user_id: int
    ip_address: str
    device: str
    browser: str
    location: str

    failed_attempts: int = 0
    new_device: bool = False
    location_change: bool = False
    impossible_travel: bool = False
    unusual_time: bool = False
    deepfake_score: float = 0.0


def calculate_risk(data: SessionRequest):

    risk = 0
    reasons = []

    if data.failed_attempts >= 3:
        risk += 10
        reasons.append("Multiple failed login attempts")

    if data.new_device:
        risk += 15
        reasons.append("New device detected")

    if data.location_change:
        risk += 20
        reasons.append("Location changed")

    if data.impossible_travel:
        risk += 25
        reasons.append("Impossible travel detected")

    if data.unusual_time:
        risk += 10
        reasons.append("Unusual login time")

    if data.deepfake_score > 0.5:
        risk += int(data.deepfake_score * 20)
        reasons.append("Possible deepfake detected")

    risk = min(risk, 100)

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

    return risk, level, status, reasons


@router.post("/create")
def create_session(
    data: SessionRequest,
    db: Session = Depends(get_db)
):

    risk, level, action, reasons = calculate_risk(data)

    session = UserSession(
        user_id=data.user_id,
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
        "reasons": reasons
    }
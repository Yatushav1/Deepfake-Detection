import logging
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import get_db
from models import User


router = APIRouter(prefix="/auth", tags=["Authentication"])

logger = logging.getLogger(__name__)
SECRET_KEY = os.getenv("AUTHPULSE_SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = secrets.token_urlsafe(32)
    logger.warning(
        "AUTHPULSE_SECRET_KEY is not set; authentication tokens will be "
        "invalidated when the server restarts."
    )
ALGORITHM = "HS256"
TOKEN_LIFETIME = timedelta(hours=24)
bearer_scheme = HTTPBearer(auto_error=False)


class RegisterRequest(BaseModel):
    username: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("username")
    @classmethod
    def trim_username(cls, value: str) -> str:
        normalized = value.strip()
        if len(normalized) < 2:
            raise ValueError("Username must contain at least 2 non-space characters")
        return normalized

    @field_validator("password")
    @classmethod
    def validate_password_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be 72 bytes or less")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=72)
    new_password: str = Field(min_length=8, max_length=72)

    @field_validator("new_password")
    @classmethod
    def validate_password_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be 72 bytes or less")
        return value


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    password_bytes = password.encode("utf-8")
    if len(password_bytes) > 72:
        return False
    try:
        return bcrypt.checkpw(password_bytes, hashed_password.encode("utf-8"))
    except ValueError:
        return False


def create_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + TOKEN_LIFETIME,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def token_response(user: User) -> dict[str, object]:
    return {
        "message": "Authentication successful",
        "access_token": create_token(user.id),
        "token_type": "bearer",
        "expires_in": int(TOKEN_LIFETIME.total_seconds()),
        "user_id": user.id,
    }


def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_scheme),
    ],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise unauthorized

    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        subject = payload.get("sub", payload.get("user_id"))
        user_id = int(subject)
    except (JWTError, TypeError, ValueError):
        raise unauthorized from None

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise unauthorized
    return user


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    data: RegisterRequest,
    db: Annotated[Session, Depends(get_db)],
) -> dict[str, object]:
    existing_user = db.query(User).filter(
        (User.email == data.email) | (User.username == data.username)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with that email or username already exists",
        )

    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with that email or username already exists",
        ) from None
    db.refresh(user)
    return token_response(user)


@router.post("/login")
def login(
    data: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
) -> dict[str, object]:
    user = db.query(User).filter(User.email == data.email).first()
    if user is None or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token_response(user)


@router.get("/me")
def current_user_profile(
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict[str, object]:
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "created_at": current_user.created_at.isoformat(),
    }


@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict[str, str]:
    if not verify_password(data.current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    if data.current_password == data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from your current password",
        )

    current_user.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

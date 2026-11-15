from datetime import timedelta
import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import OtpCode, User, utcnow
from app.schemas import ForgotIn, LoginIn, RegisterIn, ResetIn
from app.security import create_token, hash_password, verify_password
from app.serialize import user_json
from app.services.cases import normalize_phone

router = APIRouter(prefix="/auth", tags=["auth"])


def _find_login(db: Session, identifier: str) -> User | None:
    if "@" in identifier:
        return db.scalar(select(User).where(User.email == identifier.strip().lower()))
    mobile = normalize_phone(identifier)
    return db.scalar(select(User).where(User.mobile == mobile))


@router.post("/register", status_code=201)
def register(body: RegisterIn, db: Session = Depends(get_db)):
    mobile = normalize_phone(body.mobile)
    if len(mobile) < 10:
        raise HTTPException(400, "Enter a valid mobile number")
    if db.scalar(select(User).where(User.mobile == mobile)):
        raise HTTPException(409, "This mobile number is already registered")
    user = User(
        role="farmer",
        name=body.name.strip(),
        mobile=mobile,
        password_hash=hash_password(body.password),
        location=body.location,
        village=body.village,
        state=body.state,
        acreage=body.acreage,
        primary_crop_ids=body.selectedCrops,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"token": create_token(user.id, user.role), "user": user_json(user), "role": user.role}


@router.post("/login")
def login(body: LoginIn, db: Session = Depends(get_db)):
    user = _find_login(db, body.identifier)
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(401, "Identifier or password is incorrect")
    if body.role and body.role != user.role:
        raise HTTPException(403, f"This account is a {user.role} account")
    return {"token": create_token(user.id, user.role), "user": user_json(user), "role": user.role}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return user_json(user)


@router.post("/forgot-password/otp")
def forgot_password(body: ForgotIn, db: Session = Depends(get_db)):
    mobile = normalize_phone(body.mobile)
    user = db.scalar(select(User).where(User.mobile == mobile))
    if user is None:
        raise HTTPException(404, "No farmer account uses that mobile number")
    code = f"{secrets.randbelow(10000):04d}"
    db.add(OtpCode(mobile=mobile, code=code, expires_at=utcnow() + timedelta(minutes=10)))
    db.commit()
    return {
        "otp": code,
        "expiresInMinutes": 10,
        "message": "SMS is not used. This demo OTP is stored locally and returned in the response.",
    }


@router.post("/forgot-password/reset")
def reset_password(body: ResetIn, db: Session = Depends(get_db)):
    mobile = normalize_phone(body.mobile)
    otp = db.scalar(
        select(OtpCode)
        .where(OtpCode.mobile == mobile, OtpCode.code == body.otp, OtpCode.used.is_(False))
        .order_by(OtpCode.id.desc())
    )
    if otp is None or otp.expires_at < utcnow():
        raise HTTPException(400, "The OTP is missing or expired")
    user = db.scalar(select(User).where(User.mobile == mobile))
    if user is None:
        raise HTTPException(404, "No farmer account uses that mobile number")
    otp.used = True
    user.password_hash = hash_password(body.newPassword)
    db.commit()
    return {"reset": True}

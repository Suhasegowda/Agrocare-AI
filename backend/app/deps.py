from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import bearer_scheme, read_credentials


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    payload = read_credentials(credentials)
    user = db.get(User, int(payload["sub"]))
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User no longer exists")
    return user


def require_expert(user: User = Depends(get_current_user)) -> User:
    if user.role not in {"expert", "admin"}:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Expert access is required")
    return user


def user_by_mobile(db: Session, mobile: str) -> User | None:
    return db.scalar(select(User).where(User.mobile == mobile))

from datetime import date, datetime, timedelta

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import (
    CaseRecord,
    ChatMessage,
    FollowUpImage,
    Notification,
    RecoveryPoint,
    TimelineEntry,
    TreatmentLog,
    User,
    utcnow,
)


def normalize_phone(value: str) -> str:
    digits = "".join(ch for ch in value if ch.isdigit())
    if len(digits) > 10 and digits.startswith("91"):
        digits = digits[-10:]
    return digits


def today_iso() -> str:
    return date.today().isoformat()


def clock_label(moment: datetime | None = None) -> str:
    moment = moment or datetime.now()
    return f"{moment.strftime('%b')} {moment.day}, {moment.strftime('%I:%M %p')}"


def human_time(moment: datetime) -> str:
    hours = (utcnow() - moment).total_seconds() / 3600
    if hours < 1:
        return "just now"
    if hours < 24:
        whole = max(1, int(hours))
        return f"{whole} hour ago" if whole == 1 else f"{whole} hours ago"
    days = int(hours // 24)
    return "1 day ago" if days == 1 else f"{days} days ago"


def severity_label(percent: int | None) -> str | None:
    if percent is None:
        return None
    if percent <= 20:
        return "Mild"
    if percent <= 45:
        return "Moderate"
    return "Severe"


def due_days(case: CaseRecord) -> int:
    if case.status == "Resolved" or not case.next_follow_up or case.next_follow_up == "Completed":
        return 0
    try:
        follow = date.fromisoformat(case.next_follow_up)
    except ValueError:
        return 0
    return (follow - date.today()).days


def is_overdue(case: CaseRecord) -> bool:
    return case.status != "Resolved" and due_days(case) < 0


def day_label(case: CaseRecord) -> str:
    try:
        start = date.fromisoformat(case.date_created)
    except ValueError:
        return "Day 0"
    return f"Day {(date.today() - start).days}"


def next_case_id(db: Session) -> str:
    year = date.today().year
    prefix = f"AGC-{year}-"
    rows = db.scalars(select(CaseRecord.id)).all()
    numbers = []
    for row in rows:
        parts = row.split("-")
        if len(parts) == 3 and parts[0] == "AGC" and parts[1] == str(year):
            try:
                numbers.append(int(parts[2]))
            except ValueError:
                continue
    number = max(numbers, default=1000) + 1
    while db.get(CaseRecord, f"{prefix}{number:04d}") is not None:
        number += 1
    return f"{prefix}{number:04d}"


def require_owner(db: Session, user: User, case_id: str) -> CaseRecord:
    case = db.get(CaseRecord, case_id)
    if case is None:
        raise HTTPException(404, "Case not found")
    if case.owner_id != user.id:
        raise HTTPException(403, "You are not allowed to open this case")
    return case


def require_reader(db: Session, user: User, case_id: str) -> CaseRecord:
    case = db.get(CaseRecord, case_id)
    if case is None:
        raise HTTPException(404, "Case not found")
    if case.owner_id != user.id and user.role not in {"expert", "admin"}:
        raise HTTPException(403, "You are not allowed to open this case")
    return case


def add_timeline(db: Session, case: CaseRecord, label: str, note: str, status: str | None = None) -> None:
    db.add(
        TimelineEntry(
            case_id=case.id,
            day=day_label(case),
            label=label,
            severity=case.severity_percent,
            status=status or case.status,
            note=note,
        )
    )


def ensure_followup_notifications(db: Session, user: User) -> None:
    cases = db.scalars(select(CaseRecord).where(CaseRecord.owner_id == user.id)).all()
    for case in cases:
        if case.status == "Resolved" or due_days(case) > 0:
            continue
        key = f"follow-up:{case.id}"
        title = f"Follow-up {'overdue' if due_days(case) < 0 else 'due'}: {case.disease or case.crop}"
        description = (
            f"Case {case.id} was due on {case.next_follow_up}. Upload a new photo of the same leaf. "
            "A photo does not close the case."
        )
        existing = db.scalar(select(Notification).where(Notification.dedupe_key == key))
        if existing:
            existing.title = title
            existing.description = description
            continue
        db.add(
            Notification(
                user_id=user.id,
                type="follow-up",
                title=title,
                description=description,
                case_id=case.id,
                action_text="Upload Follow-up",
                dedupe_key=key,
                created_at=utcnow(),
            )
        )


def default_follow_up() -> str:
    return (date.today() + timedelta(days=7)).isoformat()


def chat_row(message: ChatMessage) -> dict:
    payload = {
        "id": message.id,
        "sender": message.sender,
        "time": message.time,
        "text": message.text,
        "notVerified": bool(message.not_verified),
    }
    if message.citations:
        payload["citations"] = message.citations
    return payload

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.catalog import CATALOG_NOTE, CROPS_SUPPORTED
from app.database import get_db
from app.deps import get_current_user, require_expert
from app.models import CaseRecord, Notification, Product, Shop, User
from app.routers.care import _product_json, _shop_json
from app.schemas import PreferenceIn, ProfilePatch, ReviewIn
from app.serialize import case_json, notification_json, user_json
from app.services.cases import (
    add_timeline,
    ensure_followup_notifications,
    require_reader,
    severity_label,
    today_iso,
)
from app.services.weather import build_weather_view, fetch_open_meteo

router = APIRouter(tags=["platform"])


@router.get("/crops")
def crops():
    return CROPS_SUPPORTED


@router.get("/products")
def products(disease: str | None = None, db: Session = Depends(get_db)):
    rows = db.scalars(select(Product)).all()
    items = [_product_json(row) for row in rows]
    if disease:
        needle = disease.lower()
        items = [item for item in items if any(needle in target.lower() or target.lower() in needle for target in item["targetDiseases"])]
    return {"liveInventory": False, "priceIsLive": False, "note": CATALOG_NOTE, "items": items}


@router.get("/shops")
@router.get("/shops/nearby")
def shops(db: Session = Depends(get_db)):
    rows = db.scalars(select(Shop)).all()
    return {"liveInventory": False, "note": CATALOG_NOTE, "items": [_shop_json(row) for row in rows]}


@router.get("/weather")
def weather(location: str = "Mandya, Karnataka"):
    try:
        name, payload = fetch_open_meteo(location)
    except RuntimeError as exc:
        raise HTTPException(503, str(exc)) from exc
    return build_weather_view(name, payload)


@router.get("/users/me/profile")
def profile(user: User = Depends(get_current_user)):
    return user_json(user)


@router.patch("/users/me/profile")
def update_profile(body: ProfilePatch, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if body.name is not None:
        user.name = body.name
    if body.location is not None:
        user.location = body.location
    if body.village is not None:
        user.village = body.village
    if body.state is not None:
        user.state = body.state
    if body.acreage is not None:
        user.acreage = body.acreage
    if body.soilType is not None:
        user.soil_type = body.soilType
    if body.irrigation is not None:
        user.irrigation = body.irrigation
    if body.language is not None:
        if body.language not in {"en", "kn"}:
            raise HTTPException(400, "language must be en or kn")
        user.language = body.language
    if body.selectedCrops is not None:
        user.primary_crop_ids = body.selectedCrops
    db.commit()
    return user_json(user)


@router.get("/users/me/export")
def export_account(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(CaseRecord).where(CaseRecord.owner_id == user.id)).all()
    return {"profile": user_json(user), "cases": [case_json(db, row) for row in rows]}


@router.put("/users/me/notification-preferences")
def preferences(body: PreferenceIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.sms_alerts = body.smsAlerts
    user.whatsapp_alerts = body.whatsAppAlerts
    db.commit()
    payload = user_json(user)
    payload["message"] = "Preferences are stored. SMS and WhatsApp are not sent."
    return payload


@router.get("/notifications")
def notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ensure_followup_notifications(db, user)
    db.commit()
    rows = db.scalars(
        select(Notification).where(Notification.user_id == user.id).order_by(Notification.created_at.desc())
    ).all()
    return [notification_json(row) for row in rows]


@router.patch("/notifications/read-all")
def read_all(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Notification).where(Notification.user_id == user.id)).all()
    for row in rows:
        row.unread = False
    db.commit()
    return {"updated": len(rows)}


@router.patch("/notifications/{notification_id}")
def read_one(notification_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = db.get(Notification, notification_id)
    if row is None or row.user_id != user.id:
        raise HTTPException(404, "Notification not found")
    row.unread = False
    db.commit()
    return notification_json(row)


@router.get("/notifications/calendar")
def calendar(month: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(CaseRecord).where(CaseRecord.owner_id == user.id)).all()
    dates = []
    for case in rows:
        if case.status == "Resolved" or not case.next_follow_up:
            continue
        if case.next_follow_up.startswith(month):
            dates.append({"date": case.next_follow_up, "caseId": case.id, "title": case.disease or "Follow-up"})
    return {"month": month, "dates": dates}


@router.get("/expert/queue")
def expert_queue(user: User = Depends(require_expert), db: Session = Depends(get_db)):
    rows = db.scalars(select(CaseRecord).where(CaseRecord.expert_required.is_(True))).all()
    queued = [row for row in rows if row.expert_status != "Approved"]
    return [_queue_item(row) for row in queued]


@router.get("/expert/queue/{case_id}")
def expert_case(case_id: str, user: User = Depends(require_expert), db: Session = Depends(get_db)):
    case = require_reader(db, user, case_id)
    return {**_queue_item(case), "case": case_json(db, case)}


@router.post("/expert/reviews")
def review_case(body: ReviewIn, user: User = Depends(require_expert), db: Session = Depends(get_db)):
    if body.decision.lower() not in {"approve", "override"}:
        raise HTTPException(400, "decision must be approve or override")
    case = db.get(CaseRecord, body.caseId)
    if case is None:
        raise HTTPException(404, "Case not found")
    case.disease = body.verifiedDisease.strip()
    case.severity_percent = body.severityPercent
    case.severity = severity_label(body.severityPercent)
    case.expert_required = True
    case.expert_status = "Approved"
    case.expert_reviewed_by = user.name
    case.expert_date = today_iso()
    case.expert_note = body.note
    case.last_update = today_iso()
    add_timeline(
        db,
        case,
        "Expert review",
        f"{user.name} recorded an {body.decision.lower()} review. This does not create a model confidence score.",
        case.status,
    )
    db.add(
        Notification(
            user_id=case.owner_id,
            type="expert-review",
            title="Expert note added",
            description=f"{user.name} reviewed case {case.id}.",
            case_id=case.id,
            action_text="View Doctor Note",
            dedupe_key=None,
        )
    )
    db.commit()
    return case_json(db, case)


def _queue_item(case: CaseRecord) -> dict:
    if case.severity and case.severity_percent is not None:
        severity = f"{case.severity} ({case.severity_percent}%)"
    else:
        severity = case.severity
    return {
        "caseId": case.id,
        "farmerName": case.farmer_name,
        "crop": case.crop,
        "predictedDisease": case.disease,
        "confidence": case.confidence,
        "severity": severity,
        "submittedAt": case.expert_date or case.date_created,
        "reasonForReview": case.expert_reason,
        "farmerNotes": case.farmer_notes,
        "imageUrl": case.image_url,
    }

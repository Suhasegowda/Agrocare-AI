from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import ChatMessage, FollowUpImage, Product, RecoveryPoint, Shop, TreatmentLog, User
from app.schemas import ChatIn, TreatmentLogIn
from app.serialize import case_json
from app.services.advisory import get_index
from app.services.cases import add_timeline, clock_label, require_owner, today_iso
from app.services.images import is_blurry, save_upload
from app.services.recovery import assess_follow_up

router = APIRouter(tags=["care"])

LOG_TYPES = {"Chemical", "Biological", "Cultural"}


def _flag(value: str | None) -> bool:
    return str(value or "").lower() in {"1", "true", "yes", "on"}


@router.get("/cases/{case_id}/treatment-plan")
def treatment_plan(case_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    products = db.scalars(select(Product)).all()
    shops = db.scalars(select(Shop)).all()
    disease = (case.disease or "").lower()
    matched = []
    for product in products:
        targets = [item.lower() for item in (product.target_diseases or [])]
        if not disease or any(target in disease or disease in target for target in targets):
            matched.append(_product_json(product))
    return {
        "disease": case.disease,
        "confirmed": case.confirmed,
        "uncertain": case.uncertain,
        "culturalControl": case.cultural_control or [],
        "biologicalControl": case.biological_control or [],
        "chemicalControl": case.chemical_control or [],
        "safetyNotes": case.safety_notes or [],
        "disclaimer": "Chemical lines, if any, are copied label references. AgroCare does not prescribe a dose.",
        "liveInventory": False,
        "products": matched,
        "shops": [_shop_json(shop) for shop in shops],
    }


@router.get("/cases/{case_id}/treatment-logs")
def list_logs(case_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    rows = db.scalars(select(TreatmentLog).where(TreatmentLog.case_id == case.id).order_by(TreatmentLog.id)).all()
    return [{"date": row.date, "action": row.action, "type": row.type} for row in rows]


@router.post("/cases/{case_id}/treatment-logs", status_code=201)
def add_log(case_id: str, body: TreatmentLogIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    if body.type not in LOG_TYPES:
        raise HTTPException(400, "type must be Chemical, Biological, or Cultural")
    if not body.action.strip():
        raise HTTPException(400, "Describe the action you recorded")
    row = TreatmentLog(case_id=case.id, date=body.date or today_iso(), action=body.action.strip(), type=body.type)
    db.add(row)
    case.last_update = today_iso()
    add_timeline(db, case, "Activity recorded", f"Farmer recorded a {body.type.lower()} activity.", case.status)
    db.commit()
    return {"date": row.date, "action": row.action, "type": row.type}


@router.get("/cases/{case_id}/recovery")
def recovery(case_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    payload = case_json(db, case)
    return {
        "status": payload["status"],
        "followUpDueDays": payload["followUpDueDays"],
        "overdue": payload["overdue"],
        "nextFollowUp": payload["nextFollowUp"],
        "recoveryHistory": payload["recoveryHistory"],
        "followUpImages": payload["followUpImages"],
        "timeline": payload["timeline"],
        "note": "Assessments are qualitative. They are not proof of cure.",
    }


@router.post("/cases/{case_id}/follow-ups")
def follow_up(
    case_id: str,
    image: UploadFile | None = File(None),
    samePlant: str = Form("true"),
    newLesions: str = Form("false"),
    symptomsConsistent: str = Form("false"),
    noNewSymptoms: str = Form("false"),
    conflict: str = Form("false"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    case = require_owner(db, user, case_id)
    image_present = image is not None and bool(image.filename)
    blurry = False
    image_url = None
    if image_present:
        path, picture, image_url = save_upload(image, user.id)
        blurry = is_blurry(picture)
    decision = assess_follow_up(
        image_present=image_present,
        blurry=blurry,
        same_plant=_flag(samePlant),
        new_lesions=_flag(newLesions),
        symptoms_consistent=_flag(symptomsConsistent),
        no_new_symptoms=_flag(noNewSymptoms),
        conflict=_flag(conflict),
    )
    if decision["assessment"] != "retake" and image_url:
        db.add(
            FollowUpImage(
                case_id=case.id,
                date=today_iso(),
                url=image_url,
                severity=case.severity_percent,
                note=decision["message"],
                assessment=decision["assessment"],
            )
        )
        healthy = None if case.severity_percent is None else 100 - case.severity_percent
        db.add(
            RecoveryPoint(
                case_id=case.id,
                day=f"Follow-up {today_iso()}",
                severity=case.severity_percent,
                healthy_percent=healthy,
                qualitative=True,
                assessment=decision["assessment"],
            )
        )
        if decision["updateStatus"] and case.status != "Resolved":
            case.status = decision["updateStatus"]
        case.last_update = today_iso()
        add_timeline(db, case, "Follow-up", decision["message"], case.status)
        db.commit()
    return {
        "assessment": decision["assessment"],
        "message": decision["message"],
        "closed": False,
        "case": case_json(db, case),
    }


@router.get("/cases/{case_id}/chat/messages")
def list_messages(case_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    return case_json(db, case)["chatMessages"]


@router.post("/cases/{case_id}/chat/messages", status_code=201)
def send_message(case_id: str, body: ChatIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    text = body.text.strip()
    if not text:
        raise HTTPException(400, "Message is empty")
    farmer = ChatMessage(case_id=case.id, sender="farmer", time=clock_label(), text=text, citations=None, not_verified=False)
    db.add(farmer)
    db.flush()
    answer = get_index().answer(text, crop_id=case.crop_id, disease=case.disease)
    reply = ChatMessage(
        case_id=case.id,
        sender="ai",
        time=clock_label(),
        text=answer["text"],
        citations=answer.get("citations"),
        not_verified=bool(answer.get("notVerified")),
    )
    db.add(reply)
    case.last_update = today_iso()
    db.commit()
    db.refresh(farmer)
    db.refresh(reply)
    from app.services.cases import chat_row

    return {"farmer": chat_row(farmer), "ai": chat_row(reply), "sourceUrl": answer.get("sourceUrl")}


def _product_json(product: Product) -> dict:
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "type": product.type,
        "activeIngredient": product.active_ingredient,
        "cibNumber": product.cib_number,
        "rating": product.rating,
        "reviewsCount": product.reviews_count,
        "targetDiseases": product.target_diseases or [],
        "price": product.price,
        "dosage": product.dosage,
        "safetyTag": product.safety_tag,
        "seller": product.seller,
        "inStock": None,
        "liveInventory": False,
        "priceIsLive": False,
    }


def _shop_json(shop: Shop) -> dict:
    return {
        "id": shop.id,
        "name": shop.name,
        "proprietor": shop.proprietor,
        "phone": shop.phone,
        "address": shop.address,
        "distance": shop.distance,
        "openStatus": shop.open_status,
        "verified": shop.verified,
        "availableBrands": shop.available_brands or [],
        "rating": shop.rating,
        "liveInventory": False,
    }

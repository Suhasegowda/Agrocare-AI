from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import CaseRecord, DiagnosisRecord, FollowUpImage, RecoveryPoint, User
from app.schemas import CaseCreate, CasePatch, CloseIn, ExpertRequestIn
from app.serialize import case_json
from app.services.cases import add_timeline, default_follow_up, next_case_id, require_owner, require_reader, today_iso

router = APIRouter(tags=["cases"])


@router.get("/cases")
def list_cases(
    status: str | None = None,
    crop: str | None = None,
    q: str | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = select(CaseRecord)
    if user.role not in {"expert", "admin"}:
        query = query.where(CaseRecord.owner_id == user.id)
    if status:
        query = query.where(CaseRecord.status == status)
    if crop:
        query = query.where(or_(CaseRecord.crop_id == crop, CaseRecord.crop.ilike(f"%{crop}%")))
    if q:
        like = f"%{q}%"
        query = query.where(or_(CaseRecord.id.ilike(like), CaseRecord.disease.ilike(like), CaseRecord.crop.ilike(like)))
    rows = db.scalars(query.order_by(CaseRecord.date_created.desc())).all()
    return [case_json(db, row) for row in rows]


@router.get("/cases/{case_id}")
def get_case(case_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return case_json(db, require_reader(db, user, case_id))


@router.post("/cases", status_code=201)
def create_case(body: CaseCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    diagnosis = db.get(DiagnosisRecord, body.diagnosisId)
    if diagnosis is None or diagnosis.user_id != user.id:
        raise HTTPException(404, "Diagnosis not found")
    existing = db.scalar(select(CaseRecord).where(CaseRecord.diagnosis_id == diagnosis.id))
    if existing:
        raise HTTPException(409, "A case already exists for this diagnosis")
    result = diagnosis.result or {}
    uncertain = bool(result.get("uncertain", True))
    case = CaseRecord(
        id=next_case_id(db),
        owner_id=user.id,
        farmer_name=user.name,
        crop=result.get("crop") or "",
        crop_id=result.get("cropId") or diagnosis.crop_id,
        variety=body.variety,
        field=body.field,
        disease=result.get("disease"),
        pathogen=result.get("pathogen"),
        pathogen_type=result.get("pathogenType"),
        severity=None,
        severity_percent=None,
        status="Active",
        confidence=result.get("confidence"),
        confirmed=bool(result.get("confirmed")),
        uncertain=uncertain,
        healthy_class=bool(result.get("healthyClass")),
        demo_fixture=False,
        date_created=today_iso(),
        last_update=today_iso(),
        next_follow_up=default_follow_up(),
        image_url=result.get("imageUrl"),
        grad_cam_url=result.get("gradCamUrl"),
        symptoms=result.get("symptoms") or [],
        cultural_control=result.get("culturalControl") or [],
        biological_control=result.get("biologicalControl") or [],
        chemical_control=result.get("chemicalControl") or [],
        safety_notes=result.get("safetyNotes") or [],
        plant_stage=result.get("plantStage"),
        symptom_flags=result.get("symptomFlags") or {},
        expert_required=uncertain,
        expert_status="In Review" if uncertain else None,
        expert_reason=result.get("message") if uncertain else None,
        farmer_notes=body.farmerNotes,
        diagnosis_id=diagnosis.id,
        model_message=result.get("message"),
    )
    db.add(case)
    db.flush()
    add_timeline(db, case, "Initial record", result.get("message") or "Case opened.", "Active")
    db.add(RecoveryPoint(case_id=case.id, day="Day 0", severity=None, healthy_percent=None, qualitative=True, assessment="baseline"))
    if result.get("imageUrl"):
        db.add(
            FollowUpImage(
                case_id=case.id,
                date=f"{today_iso()} (Day 0)",
                url=result["imageUrl"],
                severity=None,
                note="Initial photo",
                assessment="baseline",
            )
        )
    db.commit()
    return case_json(db, case)


@router.patch("/cases/{case_id}")
def patch_case(case_id: str, body: CasePatch, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    if body.status == "Resolved":
        raise HTTPException(400, "Use the close endpoint. A status change alone cannot close a case.")
    if body.status is not None:
        if body.status not in {"Active", "In Recovery"}:
            raise HTTPException(400, "Status must be Active or In Recovery")
        case.status = body.status
    if body.variety is not None:
        case.variety = body.variety
    if body.field is not None:
        case.field = body.field
    if body.nextFollowUp is not None:
        try:
            date.fromisoformat(body.nextFollowUp)
        except ValueError as exc:
            raise HTTPException(400, "nextFollowUp must be YYYY-MM-DD") from exc
        case.next_follow_up = body.nextFollowUp
    case.last_update = today_iso()
    db.commit()
    return case_json(db, case)


@router.post("/cases/{case_id}/close")
def close_case(case_id: str, body: CloseIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    if not body.confirm or not body.noNewSymptoms:
        raise HTTPException(
            400,
            "Closing requires your confirmation and an absence-of-new-symptoms checklist. A photo alone cannot close a case.",
        )
    if case.status != "Resolved":
        case.status = "Resolved"
        case.closure_confirmed = True
        case.no_new_symptoms = True
        case.next_follow_up = None
        case.last_update = today_iso()
        add_timeline(
            db,
            case,
            "Closed by farmer confirmation",
            "Closed after farmer confirmation and an absence-of-new-symptoms checklist. This is not a biological guarantee of cure.",
            "Resolved",
        )
        db.commit()
    return case_json(db, case)


@router.post("/cases/{case_id}/reopen")
def reopen_case(case_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    case.status = "Active"
    case.closure_confirmed = False
    case.no_new_symptoms = False
    case.next_follow_up = default_follow_up()
    case.last_update = today_iso()
    add_timeline(db, case, "Case reopened", "Previous photos, messages, and activity logs were kept.", "Active")
    db.commit()
    return case_json(db, case)


@router.post("/cases/{case_id}/expert-review-request")
def request_review(case_id: str, body: ExpertRequestIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    case = require_owner(db, user, case_id)
    case.expert_required = True
    case.expert_status = "In Review"
    case.expert_reason = body.note or "Farmer requested a review."
    case.farmer_notes = body.note or case.farmer_notes
    case.last_update = today_iso()
    add_timeline(db, case, "Expert review requested", case.expert_reason, case.status)
    db.commit()
    return case_json(db, case)


@router.get("/farmers/me/dashboard")
def dashboard(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(CaseRecord).where(CaseRecord.owner_id == user.id)).all()
    counts = {"Active": 0, "In Recovery": 0, "Resolved": 0}
    for row in rows:
        if row.status in counts:
            counts[row.status] += 1
    return {"farmerName": user.name, "counts": counts, "cases": [case_json(db, row) for row in rows]}

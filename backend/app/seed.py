from datetime import date, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.catalog import PRODUCTS, SHOPS
from app.models import (
    CaseRecord,
    ChatMessage,
    FollowUpImage,
    Notification,
    Product,
    RecoveryPoint,
    Shop,
    TimelineEntry,
    TreatmentLog,
    User,
    utcnow,
)
from app.security import hash_password


def _ago(days: int) -> str:
    return (date.today() - timedelta(days=days)).isoformat()


def _ahead(days: int) -> str:
    return (date.today() + timedelta(days=days)).isoformat()


def seed_if_empty(db: Session) -> None:
    existing = db.scalar(select(func.count()).select_from(User))
    if existing:
        return

    farmer = User(
        role="farmer",
        name="Ramesh Gowda",
        mobile="9845122390",
        password_hash=hash_password("farmerPass123"),
        location="Mandya, Karnataka",
        village="Shivalli, Mandya Taluk",
        state="Karnataka",
        acreage="3.5",
        soil_type="Red Sandy Loam",
        irrigation="Drip Irrigation",
        language="en",
        primary_crop_ids=["tomato", "potato"],
    )
    other = User(
        role="farmer",
        name="Basavaraj K",
        mobile="9448210934",
        password_hash=hash_password("farmerPass123"),
        location="Mandya, Karnataka",
        village="Mandya",
        state="Karnataka",
        acreage="1.5",
        language="en",
        primary_crop_ids=["cotton"],
    )
    expert = User(
        role="expert",
        name="Dr. Ramesh Kumar",
        email="dr.ramesh@uasb.edu.in",
        password_hash=hash_password("expertPass123"),
        location="UAS Bangalore",
        language="en",
    )
    admin = User(
        role="admin",
        name="AgroCare Admin",
        email="admin@agrocare.local",
        password_hash=hash_password("adminPass123"),
        language="en",
    )
    db.add_all([farmer, other, expert, admin])
    db.flush()

    tomato = _case(
        db,
        owner=farmer,
        case_id="AGC-2026-8841",
        crop="Tomato",
        crop_id="tomato",
        variety="Arka Rakshak (F1)",
        field="Plot A - North Terrace (1.2 Acres)",
        disease="Tomato Early Blight",
        pathogen="Alternaria solani",
        severity="Moderate",
        severity_percent=38,
        status="In Recovery",
        created=_ago(14),
        updated=_ago(2),
        follow=_ago(2),
        image_url="https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80",
        expert_required=False,
        expert_status="Approved",
        expert_by="Dr. Ramesh Kumar",
        expert_note="Demo fixture review. This confidence was not measured by a model on this machine.",
        expert_date=_ago(12),
    )
    potato = _case(
        db,
        owner=farmer,
        case_id="AGC-2026-9024",
        crop="Potato",
        crop_id="potato",
        variety="Kufri Jyoti",
        field="Plot B - South Hill (0.8 Acres)",
        disease="Potato Late Blight",
        pathogen="Phytophthora infestans",
        severity="Severe",
        severity_percent=62,
        status="Active",
        created=_ago(3),
        updated=_ago(1),
        follow=_ahead(1),
        image_url="https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=800&q=80",
        expert_required=True,
        expert_status="In Review",
        expert_by=None,
        expert_note="Waiting for an expert. The stored severity is a demo fixture, not a model score.",
        expert_date=_ago(1),
        expert_reason="Queued because late blight can move quickly and this demo case was not confirmed by a loaded classifier.",
        farmer_notes="Rapid leaf darkening after overnight rain.",
    )
    corn = _case(
        db,
        owner=farmer,
        case_id="AGC-2026-7512",
        crop="Maize / Corn",
        crop_id="corn",
        variety="Pioneer 3396",
        field="Field C - River Bank (2.5 Acres)",
        disease="Southern Corn Leaf Blight",
        pathogen="Bipolaris maydis",
        severity="Mild",
        severity_percent=12,
        status="Resolved",
        created=_ago(30),
        updated=_ago(10),
        follow=None,
        image_url="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
        expert_required=False,
        expert_status="Approved",
        expert_by="Dr. Ramesh Kumar",
        expert_note="Demo fixture closed by a recorded farmer confirmation, not by a single photo.",
        expert_date=_ago(10),
        closure=True,
    )
    cotton = _case(
        db,
        owner=other,
        case_id="AGC-2026-9118",
        crop="Cotton",
        crop_id="cotton",
        variety="Local Bt",
        field="Plot D",
        disease="Cotton Bacterial Blight",
        pathogen=None,
        severity="Moderate",
        severity_percent=44,
        status="Active",
        created=_ago(1),
        updated=_ago(1),
        follow=_ahead(6),
        image_url=None,
        expert_required=True,
        expert_status="In Review",
        expert_by=None,
        expert_note="Cotton is outside the PlantVillage image classes, so a photo cannot confirm this.",
        expert_date=_ago(1),
        expert_reason="Farmer asked for a second look. The image model does not cover cotton.",
        farmer_notes="Angular spots between the leaf veins.",
    )

    _children(db, tomato, potato, corn)
    db.add_all(
        [
            Notification(
                user_id=farmer.id,
                type="follow-up",
                title="Follow-up overdue: Tomato Early Blight",
                description="Case AGC-2026-8841 needs a new leaf photo. This in-app reminder is not an SMS.",
                case_id=tomato.id,
                action_text="Upload Follow-up",
                dedupe_key="follow-up:AGC-2026-8841",
                unread=True,
                created_at=utcnow(),
            ),
            Notification(
                user_id=farmer.id,
                type="weather-alert",
                title="In-app weather note",
                description="Open the weather endpoint for a live Open-Meteo window. This row is not an SMS or WhatsApp message.",
                case_id=None,
                action_text="Check Weather",
                dedupe_key="weather-alert:demo",
                unread=True,
                created_at=utcnow(),
            ),
            Notification(
                user_id=farmer.id,
                type="expert-review",
                title="Demo review recorded",
                description="Case AGC-2026-8841 has a demo expert note. It is not a new model result.",
                case_id=tomato.id,
                action_text="View Doctor Note",
                dedupe_key="expert-review:AGC-2026-8841",
                unread=False,
                created_at=utcnow(),
            ),
            Notification(
                user_id=farmer.id,
                type="case-healed",
                title="Case closed in the demo history",
                description="Case AGC-2026-7512 is resolved in the seed data. Closure still required a confirmation flag.",
                case_id=corn.id,
                action_text="View Timeline",
                dedupe_key="case-healed:AGC-2026-7512",
                unread=False,
                created_at=utcnow(),
            ),
        ]
    )
    for row in PRODUCTS:
        db.add(
            Product(
                id=row["id"],
                name=row["name"],
                category=row["category"],
                type=row["type"],
                active_ingredient=row["activeIngredient"],
                cib_number=row["cibNumber"],
                rating=row["rating"],
                reviews_count=row["reviewsCount"],
                target_diseases=row["targetDiseases"],
                price=row["price"],
                dosage=row["dosage"],
                safety_tag=row["safetyTag"],
                seller=row["seller"],
            )
        )
    for row in SHOPS:
        db.add(
            Shop(
                id=row["id"],
                name=row["name"],
                proprietor=row["proprietor"],
                phone=row["phone"],
                address=row["address"],
                distance=row["distance"],
                open_status=row["openStatus"],
                verified=row["verified"],
                available_brands=row["availableBrands"],
                rating=row["rating"],
            )
        )
    db.commit()


def _case(db, owner, case_id, crop, crop_id, variety, field, disease, pathogen, severity, severity_percent, status, created, updated, follow, image_url, expert_required, expert_status, expert_by, expert_note, expert_date, expert_reason=None, farmer_notes=None, closure=False):
    case = CaseRecord(
        id=case_id,
        owner_id=owner.id,
        farmer_name=owner.name,
        crop=crop,
        crop_id=crop_id,
        variety=variety,
        field=field,
        disease=disease,
        pathogen=pathogen,
        severity=severity,
        severity_percent=severity_percent,
        status=status,
        confidence=None,
        confirmed=False,
        uncertain=True,
        demo_fixture=True,
        date_created=created,
        last_update=updated,
        next_follow_up=follow,
        image_url=image_url,
        symptoms=[],
        cultural_control=[],
        biological_control=[],
        chemical_control=[],
        safety_notes=[],
        expert_required=expert_required,
        expert_reviewed_by=expert_by,
        expert_status=expert_status,
        expert_date=expert_date,
        expert_note=expert_note,
        expert_reason=expert_reason,
        farmer_notes=farmer_notes,
        closure_confirmed=closure,
        no_new_symptoms=closure,
        model_message="Seeded demo case. No classifier confidence is stored.",
    )
    db.add(case)
    db.flush()
    return case


def _children(db, tomato, potato, corn) -> None:
    db.add_all(
        [
            TimelineEntry(case_id=tomato.id, day="Day 0", label="Case opened", severity=38, status="Active", note="Demo record opened for Tomato Early Blight. No model confidence is stored."),
            TimelineEntry(case_id=tomato.id, day="Day 4", label="Farmer follow-up", severity=38, status="In Recovery", note="Farmer reported the spots looked drier. Severity was not remeasured from a mask."),
            TimelineEntry(case_id=potato.id, day="Day 0", label="Case opened", severity=62, status="Active", note="Demo record queued for expert review."),
            TimelineEntry(case_id=corn.id, day="Day 0", label="Case opened", severity=12, status="Active", note="Demo record opened."),
            TimelineEntry(case_id=corn.id, day="Day 14", label="Closed by confirmation", severity=12, status="Resolved", note="Closed in seed data after a recorded confirmation. Not proof of cure."),
            RecoveryPoint(case_id=tomato.id, day="Day 0", severity=38, healthy_percent=62, qualitative=True, assessment="baseline"),
            RecoveryPoint(case_id=tomato.id, day="Day 7", severity=38, healthy_percent=62, qualitative=True, assessment="stable"),
            RecoveryPoint(case_id=potato.id, day="Day 0", severity=62, healthy_percent=38, qualitative=True, assessment="baseline"),
            RecoveryPoint(case_id=corn.id, day="Day 0", severity=12, healthy_percent=88, qualitative=True, assessment="baseline"),
            FollowUpImage(case_id=tomato.id, date="Day 0", url=tomato.image_url, severity=38, note="Initial demo photo", assessment="baseline"),
            FollowUpImage(case_id=potato.id, date="Day 0", url=potato.image_url, severity=62, note="Initial demo photo", assessment="baseline"),
            TreatmentLog(case_id=tomato.id, date=tomato.date_created, action="Farmer recorded pruning of infected lower leaves", type="Cultural"),
            TreatmentLog(case_id=potato.id, date=potato.date_created, action="Farmer recorded a spray they applied. The app did not choose the dose.", type="Chemical"),
            ChatMessage(
                case_id=tomato.id,
                sender="ai",
                time="Day 0",
                text="This demo case is recorded as Tomato Early Blight. Ask about pruning or sanitation. A spray dose will be refused.",
                citations=["ICAR–NRIIPM technical bulletins"],
                not_verified=False,
            ),
            ChatMessage(
                case_id=potato.id,
                sender="ai",
                time="Day 0",
                text="This potato case is waiting for an expert. No fungicide dose is stored as a prescription.",
                citations=["ICAR–NRIIPM technical bulletins"],
                not_verified=False,
            ),
        ]
    )

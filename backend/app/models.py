from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, JSON, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    role: Mapped[str] = mapped_column(String(20), default="farmer")
    name: Mapped[str] = mapped_column(String(120))
    mobile: Mapped[str | None] = mapped_column(String(20), nullable=True, index=True)
    email: Mapped[str | None] = mapped_column(String(180), nullable=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(200))
    location: Mapped[str | None] = mapped_column(String(180), nullable=True)
    village: Mapped[str | None] = mapped_column(String(180), nullable=True)
    state: Mapped[str | None] = mapped_column(String(80), nullable=True)
    acreage: Mapped[str | None] = mapped_column(String(40), nullable=True)
    soil_type: Mapped[str | None] = mapped_column(String(80), nullable=True)
    irrigation: Mapped[str | None] = mapped_column(String(80), nullable=True)
    language: Mapped[str] = mapped_column(String(8), default="en")
    primary_crop_ids: Mapped[list] = mapped_column(JSON, default=list)
    sms_alerts: Mapped[bool] = mapped_column(Boolean, default=False)
    whatsapp_alerts: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class OtpCode(Base):
    __tablename__ = "otp_codes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mobile: Mapped[str] = mapped_column(String(20), index=True)
    code: Mapped[str] = mapped_column(String(8))
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    used: Mapped[bool] = mapped_column(Boolean, default=False)


class CaseRecord(Base):
    __tablename__ = "cases"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    farmer_name: Mapped[str] = mapped_column(String(120))
    crop: Mapped[str] = mapped_column(String(80))
    crop_id: Mapped[str] = mapped_column(String(40))
    variety: Mapped[str] = mapped_column(String(120), default="")
    field: Mapped[str] = mapped_column(String(180), default="")
    disease: Mapped[str | None] = mapped_column(String(160), nullable=True)
    pathogen: Mapped[str | None] = mapped_column(String(180), nullable=True)
    pathogen_type: Mapped[str | None] = mapped_column(String(80), nullable=True)
    severity: Mapped[str | None] = mapped_column(String(40), nullable=True)
    severity_percent: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="Active")
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    uncertain: Mapped[bool] = mapped_column(Boolean, default=True)
    healthy_class: Mapped[bool] = mapped_column(Boolean, default=False)
    demo_fixture: Mapped[bool] = mapped_column(Boolean, default=False)
    date_created: Mapped[str] = mapped_column(String(40))
    last_update: Mapped[str] = mapped_column(String(40))
    next_follow_up: Mapped[str | None] = mapped_column(String(40), nullable=True)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    grad_cam_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    symptoms: Mapped[list] = mapped_column(JSON, default=list)
    affected_area: Mapped[str | None] = mapped_column(Text, nullable=True)
    urgency: Mapped[str | None] = mapped_column(String(40), nullable=True)
    risk_factor: Mapped[str | None] = mapped_column(Text, nullable=True)
    cultural_control: Mapped[list] = mapped_column(JSON, default=list)
    biological_control: Mapped[list] = mapped_column(JSON, default=list)
    chemical_control: Mapped[list] = mapped_column(JSON, default=list)
    safety_notes: Mapped[list] = mapped_column(JSON, default=list)
    plant_stage: Mapped[str | None] = mapped_column(String(40), nullable=True)
    symptom_flags: Mapped[dict] = mapped_column(JSON, default=dict)
    expert_required: Mapped[bool] = mapped_column(Boolean, default=False)
    expert_reviewed_by: Mapped[str | None] = mapped_column(String(180), nullable=True)
    expert_status: Mapped[str | None] = mapped_column(String(40), nullable=True)
    expert_date: Mapped[str | None] = mapped_column(String(40), nullable=True)
    expert_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    expert_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    farmer_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    closure_confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    no_new_symptoms: Mapped[bool] = mapped_column(Boolean, default=False)
    diagnosis_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    model_message: Mapped[str | None] = mapped_column(Text, nullable=True)


class TimelineEntry(Base):
    __tablename__ = "timeline_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    day: Mapped[str] = mapped_column(String(80))
    label: Mapped[str] = mapped_column(String(120))
    severity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(40))
    note: Mapped[str] = mapped_column(Text)


class RecoveryPoint(Base):
    __tablename__ = "recovery_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    day: Mapped[str] = mapped_column(String(80))
    severity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    healthy_percent: Mapped[int | None] = mapped_column(Integer, nullable=True)
    qualitative: Mapped[bool] = mapped_column(Boolean, default=True)
    assessment: Mapped[str | None] = mapped_column(String(40), nullable=True)


class FollowUpImage(Base):
    __tablename__ = "follow_up_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    date: Mapped[str] = mapped_column(String(80))
    url: Mapped[str] = mapped_column(Text)
    severity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    note: Mapped[str] = mapped_column(Text, default="")
    assessment: Mapped[str | None] = mapped_column(String(40), nullable=True)


class TreatmentLog(Base):
    __tablename__ = "treatment_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    date: Mapped[str] = mapped_column(String(40))
    action: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(40))


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    sender: Mapped[str] = mapped_column(String(20))
    time: Mapped[str] = mapped_column(String(40))
    text: Mapped[str] = mapped_column(Text)
    citations: Mapped[list | None] = mapped_column(JSON, nullable=True)
    not_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class DiagnosisRecord(Base):
    __tablename__ = "diagnoses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    crop_id: Mapped[str] = mapped_column(String(40))
    plant_stage: Mapped[str | None] = mapped_column(String(40), nullable=True)
    symptom_flags: Mapped[dict] = mapped_column(JSON, default=dict)
    image_url: Mapped[str] = mapped_column(Text)
    grad_cam_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    result: Mapped[dict] = mapped_column(JSON, default=dict)
    confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    uncertain: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = (UniqueConstraint("dedupe_key", name="uq_notification_dedupe"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    type: Mapped[str] = mapped_column(String(40))
    title: Mapped[str] = mapped_column(String(180))
    description: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    unread: Mapped[bool] = mapped_column(Boolean, default=True)
    case_id: Mapped[str | None] = mapped_column(String(20), nullable=True)
    action_text: Mapped[str] = mapped_column(String(80), default="")
    dedupe_key: Mapped[str | None] = mapped_column(String(80), nullable=True)


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    name: Mapped[str] = mapped_column(String(180))
    category: Mapped[str] = mapped_column(String(120))
    type: Mapped[str] = mapped_column(String(40))
    active_ingredient: Mapped[str] = mapped_column(String(180))
    cib_number: Mapped[str] = mapped_column(String(80))
    rating: Mapped[float] = mapped_column(Float, default=0)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    target_diseases: Mapped[list] = mapped_column(JSON, default=list)
    price: Mapped[str] = mapped_column(String(80))
    dosage: Mapped[str] = mapped_column(String(120))
    safety_tag: Mapped[str] = mapped_column(String(80))
    seller: Mapped[str] = mapped_column(String(180))


class Shop(Base):
    __tablename__ = "shops"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    name: Mapped[str] = mapped_column(String(180))
    proprietor: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(40))
    address: Mapped[str] = mapped_column(String(240))
    distance: Mapped[str] = mapped_column(String(40))
    open_status: Mapped[str] = mapped_column(String(120))
    verified: Mapped[bool] = mapped_column(Boolean, default=True)
    available_brands: Mapped[list] = mapped_column(JSON, default=list)
    rating: Mapped[float] = mapped_column(Float, default=0)

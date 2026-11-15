from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import ChatMessage, FollowUpImage, RecoveryPoint, TimelineEntry, TreatmentLog
from app.services.cases import chat_row, due_days, human_time, is_overdue


def case_json(db: Session, case) -> dict:
    timeline = db.scalars(select(TimelineEntry).where(TimelineEntry.case_id == case.id).order_by(TimelineEntry.id)).all()
    history = db.scalars(select(RecoveryPoint).where(RecoveryPoint.case_id == case.id).order_by(RecoveryPoint.id)).all()
    images = db.scalars(select(FollowUpImage).where(FollowUpImage.case_id == case.id).order_by(FollowUpImage.id)).all()
    logs = db.scalars(select(TreatmentLog).where(TreatmentLog.case_id == case.id).order_by(TreatmentLog.id)).all()
    messages = db.scalars(select(ChatMessage).where(ChatMessage.case_id == case.id).order_by(ChatMessage.id)).all()
    days = due_days(case)
    return {
        "id": case.id,
        "farmerName": case.farmer_name,
        "crop": case.crop,
        "cropId": case.crop_id,
        "variety": case.variety,
        "field": case.field,
        "disease": case.disease,
        "pathogen": case.pathogen,
        "pathogenType": case.pathogen_type,
        "severity": case.severity,
        "severityPercent": case.severity_percent,
        "status": case.status,
        "confidence": case.confidence,
        "confirmed": case.confirmed,
        "uncertain": case.uncertain,
        "healthyClass": case.healthy_class,
        "demoFixture": case.demo_fixture,
        "dateCreated": case.date_created,
        "lastUpdate": case.last_update,
        "nextFollowUp": "Completed" if case.status == "Resolved" else case.next_follow_up,
        "followUpDueDays": days,
        "overdue": is_overdue(case),
        "imageUrl": case.image_url,
        "gradCamUrl": case.grad_cam_url,
        "symptoms": case.symptoms or [],
        "affectedArea": case.affected_area,
        "urgency": case.urgency,
        "riskFactor": case.risk_factor,
        "culturalControl": case.cultural_control or [],
        "biologicalControl": case.biological_control or [],
        "chemicalControl": case.chemical_control or [],
        "safetyNotes": case.safety_notes or [],
        "plantStage": case.plant_stage,
        "symptomFlags": case.symptom_flags or {},
        "message": case.model_message,
        "timeline": [
            {"day": row.day, "label": row.label, "severity": row.severity, "status": row.status, "note": row.note}
            for row in timeline
        ],
        "recoveryHistory": [
            {
                "day": row.day,
                "severity": row.severity,
                "healthyPercent": row.healthy_percent,
                "qualitative": row.qualitative,
                "assessment": row.assessment,
            }
            for row in history
        ],
        "followUpImages": [
            {"date": row.date, "url": row.url, "severity": row.severity, "note": row.note, "assessment": row.assessment}
            for row in images
        ],
        "treatmentLogs": [{"date": row.date, "action": row.action, "type": row.type} for row in logs],
        "chatMessages": [chat_row(row) for row in messages],
        "expertReview": {
            "required": case.expert_required,
            "reviewedBy": case.expert_reviewed_by,
            "status": case.expert_status,
            "date": case.expert_date,
            "note": case.expert_note,
        },
        "farmerNotes": case.farmer_notes,
    }


def notification_json(row) -> dict:
    return {
        "id": row.id,
        "type": row.type,
        "title": row.title,
        "description": row.description,
        "time": human_time(row.created_at),
        "unread": row.unread,
        "caseId": row.case_id,
        "actionText": row.action_text,
    }


def user_json(user) -> dict:
    return {
        "id": user.id,
        "role": user.role,
        "name": user.name,
        "mobile": user.mobile,
        "email": user.email,
        "location": user.location,
        "village": user.village,
        "state": user.state,
        "acreage": user.acreage,
        "soilType": user.soil_type,
        "irrigation": user.irrigation,
        "language": user.language,
        "selectedCrops": user.primary_crop_ids or [],
        "smsAlerts": user.sms_alerts,
        "whatsAppAlerts": user.whatsapp_alerts,
        "delivery": "Preferences are stored on this machine. SMS and WhatsApp are not sent.",
    }

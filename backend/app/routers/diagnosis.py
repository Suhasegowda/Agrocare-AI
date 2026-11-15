from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.deps import get_current_user
from app.knowledge import passage_for_disease
from app.models import DiagnosisRecord, User
from app.services.images import is_blurry, public_url, save_upload
from ml.labels import CLASSES, crop_name, is_known_crop, model_covers, normalize_crop_id
from ml.predict import predict_leaf

router = APIRouter(tags=["diagnosis"])


def _flag(value: str | None) -> bool:
    return str(value or "").lower() in {"1", "true", "yes", "on"}


def _chemical_lines(passage: dict | None) -> list[str]:
    if not passage or not passage.get("labelReference"):
        return ["No chemical dose is stored for this class. Read the current product label."]
    return passage["labelReference"]


@router.post("/diagnoses", status_code=201)
def create_diagnosis(
    cropId: str = Form(...),
    plantStage: str = Form("Vegetative"),
    concentricRings: str = Form("false"),
    waterSoaked: str = Form("false"),
    yellowHalo: str = Form("false"),
    leafCurl: str = Form("false"),
    image: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    crop_id = normalize_crop_id(cropId)
    if not is_known_crop(crop_id):
        raise HTTPException(400, "Unknown crop. Choose a supported crop id.")
    path, picture, image_url = save_upload(image, user.id)
    blurry = is_blurry(picture)
    prediction = predict_leaf(path, crop_id, blurry)
    passage = passage_for_disease(prediction["disease"]) if prediction["confirmed"] else None
    grad_url = public_url(prediction["gradCamPath"]) if prediction.get("gradCamPath") else None
    flags = {
        "concentricRings": _flag(concentricRings),
        "waterSoaked": _flag(waterSoaked),
        "yellowHalo": _flag(yellowHalo),
        "leafCurl": _flag(leafCurl),
    }
    result = {
        "confirmed": prediction["confirmed"],
        "uncertain": prediction["uncertain"],
        "crop": crop_name(crop_id),
        "cropId": crop_id,
        "disease": prediction["disease"],
        "pathogen": prediction["pathogen"],
        "pathogenType": prediction["pathogenType"],
        "confidence": prediction["confidence"],
        "confidenceMeaning": prediction["confidenceMeaning"],
        "severity": None,
        "severityPercent": None,
        "affectedArea": None,
        "urgency": None,
        "symptoms": (passage or {}).get("symptoms", []) if prediction["confirmed"] else [],
        "culturalControl": (passage or {}).get("culturalControl", []) if prediction["confirmed"] else [],
        "biologicalControl": (passage or {}).get("biologicalControl", []) if prediction["confirmed"] else [],
        "chemicalControl": _chemical_lines(passage) if prediction["confirmed"] else [],
        "safetyNotes": (passage or {}).get("safetyNotes", []) if prediction["confirmed"] else [],
        "imageUrl": image_url,
        "gradCamUrl": grad_url,
        "message": prediction["message"],
        "modelLoaded": prediction["modelLoaded"],
        "healthyClass": prediction["healthyClass"],
        "topCandidate": prediction["topCandidate"],
        "plantStage": plantStage,
        "symptomFlags": flags,
        "imageQuality": "low" if blurry else "ok",
        "evaluationRecorded": settings.metrics_path.exists(),
        "imageModel": model_covers(crop_id),
    }
    row = DiagnosisRecord(
        user_id=user.id,
        crop_id=crop_id,
        plant_stage=plantStage,
        symptom_flags=flags,
        image_url=image_url,
        grad_cam_url=grad_url,
        result=result,
        confirmed=prediction["confirmed"],
        uncertain=prediction["uncertain"],
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id, **result}


@router.get("/diagnoses/{diagnosis_id}")
def get_diagnosis(diagnosis_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = db.get(DiagnosisRecord, diagnosis_id)
    if row is None or row.user_id != user.id:
        raise HTTPException(404, "Diagnosis not found")
    return {"id": row.id, **(row.result or {})}


@router.get("/model/classes")
def model_classes():
    return {
        "weightsPresent": settings.weights_path.exists(),
        "classCount": len(CLASSES),
        "classes": [
            {
                "folder": item["folder"],
                "cropId": item["cropId"],
                "crop": item["crop"],
                "disease": item["disease"],
                "healthy": item["healthy"],
            }
            for item in CLASSES
        ],
    }

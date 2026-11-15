import re

from app.services.recovery import assess_follow_up
from app.services.weather import build_weather_view, spray_window
from ml.labels import CLASSES, model_covers

CASE_ID = re.compile(r"^AGC-\d{4}-\d{4}$")


def login(api, identifier, password, role):
    response = api.post("/auth/login", json={"identifier": identifier, "password": password, "role": role})
    assert response.status_code == 200, response.text
    token = response.json()["token"]
    return {"Authorization": f"Bearer {token}"}


def noise_file():
    from tests.conftest import noise_png

    return ("leaf.png", noise_png(), "image/png")


def diagnose(api, headers, crop_id="tomato", image=None):
    response = api.post(
        "/diagnoses",
        headers=headers,
        data={
            "cropId": crop_id,
            "plantStage": "Fruiting",
            "concentricRings": "true",
            "waterSoaked": "false",
            "yellowHalo": "true",
            "leafCurl": "false",
        },
        files={"image": image or noise_file()},
    )
    return response


def open_case(api, headers, crop_id="tomato"):
    diagnosis = diagnose(api, headers, crop_id)
    assert diagnosis.status_code == 201, diagnosis.text
    created = api.post("/cases", headers=headers, json={"diagnosisId": diagnosis.json()["id"], "variety": "Demo", "field": "Plot"})
    assert created.status_code == 201, created.text
    return diagnosis.json(), created.json()


def test_class_list_covers_plantvillage_not_only_tomato():
    folders = [item["folder"] for item in CLASSES]
    assert len(CLASSES) == 38
    assert len(folders) == len(set(folders))
    assert len({item["cropId"] for item in CLASSES}) == 14
    assert model_covers("tomato")
    assert model_covers("potato")
    assert model_covers("corn")
    assert model_covers("chilli")
    assert model_covers("pepper")
    assert not model_covers("rice")
    assert not model_covers("cotton")
    assert not model_covers("wheat")
    assert not model_covers("sugarcane")
    assert not model_covers("arecanut")
    assert not model_covers("coconut")
    assert not model_covers("coffee")
    assert not model_covers("tea")


def test_recovery_and_spray_rules():
    retake = assess_follow_up(
        image_present=False, blurry=False, same_plant=True, new_lesions=False,
        symptoms_consistent=True, no_new_symptoms=True, conflict=False,
    )
    assert retake["assessment"] == "retake"
    worsening = assess_follow_up(
        image_present=True, blurry=False, same_plant=True, new_lesions=True,
        symptoms_consistent=False, no_new_symptoms=False, conflict=False,
    )
    assert worsening["assessment"] == "worsening"
    conflict = assess_follow_up(
        image_present=True, blurry=False, same_plant=True, new_lesions=True,
        symptoms_consistent=True, no_new_symptoms=True, conflict=False,
    )
    assert conflict["assessment"] == "inconclusive"
    assert spray_window(10, 5)[0] == "Optimal Window"
    assert spray_window(40, 5)[0] == "Caution"
    assert spray_window(80, 5)[0] == "Unfavorable"


def test_weather_view_uses_live_payload_shape():
    payload = {
        "current": {
            "temperature_2m": 28.2,
            "relative_humidity_2m": 68,
            "weather_code": 2,
            "wind_speed_10m": 9,
            "wind_direction_10m": 45,
        },
        "daily": {
            "time": ["2026-11-14", "2026-11-15", "2026-11-16", "2026-11-17"],
            "weather_code": [2, 61, 0, 0],
            "temperature_2m_max": [31, 27, 29, 30],
            "temperature_2m_min": [21, 22, 20, 21],
            "precipitation_probability_max": [15, 70, 10, 5],
        },
    }
    view = build_weather_view("Mandya, Karnataka", payload)
    assert view["location"] == "Mandya, Karnataka"
    assert view["sprayWindowStatus"] == "Optimal Window"
    assert view["source"] == "open-meteo"
    assert len(view["forecast"]) == 4
    assert view["diseaseRiskAlert"]["level"] == "Info"


def test_login_and_catalog(api):
    headers = login(api, "98451 22390", "farmerPass123", "farmer")
    me = api.get("/auth/me", headers=headers)
    assert me.json()["name"] == "Ramesh Gowda"
    products = api.get("/products")
    assert products.status_code == 200
    body = products.json()
    assert body["liveInventory"] is False
    assert len(body["items"]) == 4
    assert all(item["inStock"] is None for item in body["items"])
    shops = api.get("/shops/nearby")
    assert len(shops.json()["items"]) == 3
    assert api.get("/crops").json()[0]["id"] == "tomato"
    assert api.get("/model/classes").json()["classCount"] == 38
    assert api.get("/model/classes").json()["weightsPresent"] is False


def test_upload_rules_and_uncertain_diagnosis(api):
    headers = login(api, "+91 98451 22390", "farmerPass123", "farmer")
    rejected = diagnose(api, headers, image=("notes.txt", b"not an image", "text/plain"))
    assert rejected.status_code == 400
    assert "Unsupported" in rejected.json()["detail"]

    tomato = diagnose(api, headers, "tomato")
    assert tomato.status_code == 201, tomato.text
    body = tomato.json()
    assert body["uncertain"] is True
    assert body["confirmed"] is False
    assert body["disease"] is None
    assert body["confidence"] is None
    assert "confirmed" in body["message"].lower() or "no disease" in body["message"].lower()
    image = api.get(body["imageUrl"])
    assert image.status_code == 200
    assert image.headers["content-type"].startswith("image/")

    rice = diagnose(api, headers, "rice")
    assert rice.status_code == 201
    assert rice.json()["disease"] is None
    assert "PlantVillage" in rice.json()["message"]


def test_cases_are_unique_and_private(api):
    farmer = login(api, "9845122390", "farmerPass123", "farmer")
    expert = login(api, "dr.ramesh@uasb.edu.in", "expertPass123", "expert")
    first = open_case(api, farmer)[1]
    second = open_case(api, farmer)[1]
    assert first["id"] != second["id"]
    assert CASE_ID.match(first["id"])
    assert CASE_ID.match(second["id"])
    hidden = api.get("/cases/AGC-2026-9118", headers=farmer)
    assert hidden.status_code == 403
    visible = api.get("/cases/AGC-2026-9118", headers=expert)
    assert visible.status_code == 200
    assert visible.json()["farmerName"] == "Basavaraj K"


def test_advisory_refuses_dosage_and_answers_sanitation(api):
    headers = login(api, "98451 22390", "farmerPass123", "farmer")
    case = open_case(api, headers)[1]
    dose = api.post(
        f"/cases/{case['id']}/chat/messages",
        headers=headers,
        json={"text": "What dosage of mancozeb should I mix in the tank?"},
    )
    assert dose.status_code == 201, dose.text
    answer = dose.json()["ai"]
    assert answer["notVerified"] is True
    assert "not verified" in answer["text"].lower()
    assert "2.0g" not in answer["text"]
    assert "ml/l" not in answer["text"].lower()

    cultural = api.post(
        f"/cases/{case['id']}/chat/messages",
        headers=headers,
        json={"text": "How should I prune infected tomato leaves with early blight?"},
    )
    assert cultural.status_code == 201, cultural.text
    reply = cultural.json()["ai"]
    assert reply["notVerified"] is False
    assert "prune" in reply["text"].lower()
    assert reply["citations"]


def test_follow_up_cannot_close_and_reopen_keeps_history(api):
    from tests.conftest import flat_png

    headers = login(api, "98451 22390", "farmerPass123", "farmer")
    case = open_case(api, headers)[1]
    case_id = case["id"]
    logged = api.post(
        f"/cases/{case_id}/treatment-logs",
        headers=headers,
        json={"action": "Farmer removed infected lower leaves", "type": "Cultural"},
    )
    assert logged.status_code == 201
    blurry = api.post(
        f"/cases/{case_id}/follow-ups",
        headers=headers,
        data={"samePlant": "true", "newLesions": "false", "symptomsConsistent": "true", "noNewSymptoms": "true", "conflict": "false"},
        files={"image": ("flat.png", flat_png(), "image/png")},
    )
    assert blurry.status_code == 200, blurry.text
    assert blurry.json()["assessment"] == "retake"
    assert blurry.json()["case"]["status"] != "Resolved"

    follow = api.post(
        f"/cases/{case_id}/follow-ups",
        headers=headers,
        data={"samePlant": "true", "newLesions": "false", "symptomsConsistent": "true", "noNewSymptoms": "true", "conflict": "false"},
        files={"image": noise_file()},
    )
    assert follow.status_code == 200, follow.text
    assert follow.json()["assessment"] == "improving"
    assert follow.json()["closed"] is False
    assert follow.json()["case"]["status"] != "Resolved"

    refused = api.post(f"/cases/{case_id}/close", headers=headers, json={"confirm": False, "noNewSymptoms": True})
    assert refused.status_code == 400
    still_open = api.get(f"/cases/{case_id}", headers=headers).json()
    assert still_open["status"] != "Resolved"

    closed = api.post(f"/cases/{case_id}/close", headers=headers, json={"confirm": True, "noNewSymptoms": True})
    assert closed.status_code == 200, closed.text
    assert closed.json()["status"] == "Resolved"
    history = closed.json()
    assert len(history["treatmentLogs"]) >= 1
    assert len(history["chatMessages"]) >= 0
    assert len(history["followUpImages"]) >= 1
    assert any("confirmation" in row["note"].lower() for row in history["timeline"])

    reopened = api.post(f"/cases/{case_id}/reopen", headers=headers)
    assert reopened.status_code == 200, reopened.text
    restored = reopened.json()
    assert restored["status"] == "Active"
    assert len(restored["treatmentLogs"]) == len(history["treatmentLogs"])
    assert len(restored["followUpImages"]) == len(history["followUpImages"])
    assert restored["imageUrl"] == history["imageUrl"]
    assert any(row["label"] == "Case reopened" for row in restored["timeline"])
    assert any("confirmation" in row["note"].lower() for row in restored["timeline"])


def test_overdue_follow_up_notification(api):
    headers = login(api, "98451 22390", "farmerPass123", "farmer")
    case = open_case(api, headers)[1]
    patched = api.patch(f"/cases/{case['id']}", headers=headers, json={"nextFollowUp": "2000-01-01"})
    assert patched.status_code == 200
    assert patched.json()["overdue"] is True
    notes = api.get("/notifications", headers=headers)
    assert notes.status_code == 200
    match = [row for row in notes.json() if row["caseId"] == case["id"] and row["type"] == "follow-up"]
    assert match
    assert "overdue" in match[0]["title"].lower()
    blocked = api.patch(f"/cases/{case['id']}", headers=headers, json={"status": "Resolved"})
    assert blocked.status_code == 400


def test_expert_review_and_otp(api):
    farmer = login(api, "98451 22390", "farmerPass123", "farmer")
    expert = login(api, "dr.ramesh@uasb.edu.in", "expertPass123", "expert")
    case = open_case(api, farmer)[1]
    denied = api.get("/expert/queue", headers=farmer)
    assert denied.status_code == 403
    queued = api.get("/expert/queue", headers=expert)
    assert queued.status_code == 200
    assert any(row["caseId"] == case["id"] for row in queued.json())
    reviewed = api.post(
        "/expert/reviews",
        headers=expert,
        json={
            "caseId": case["id"],
            "verifiedDisease": "Tomato Early Blight",
            "severityPercent": 30,
            "note": "Expert agrees with the symptom description. No dose was prescribed here.",
            "decision": "approve",
        },
    )
    assert reviewed.status_code == 200, reviewed.text
    assert reviewed.json()["expertReview"]["status"] == "Approved"
    assert reviewed.json()["confidence"] is None
    again = api.get("/expert/queue", headers=expert)
    assert all(row["caseId"] != case["id"] for row in again.json())

    otp = api.post("/auth/forgot-password/otp", json={"mobile": "98451 22390"})
    assert otp.status_code == 200, otp.text
    assert len(otp.json()["otp"]) == 4
    assert "SMS is not used" in otp.json()["message"]

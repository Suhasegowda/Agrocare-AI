# AgroCare AI backend

Local API for the AgroCare case workflow. The React app is unchanged and still uses its own mock data. This service is what a later wiring step can call.

## Run

From this folder:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://127.0.0.1:8000/docs

Demo logins:

- Farmer: `98451 22390` / `farmerPass123`
- Expert: `dr.ramesh@uasb.edu.in` / `expertPass123`
- Admin: `admin@agrocare.local` / `adminPass123`

Tests:

```powershell
python -m pytest
```

## Diagnosis

Image classes are the 38 PlantVillage folders (14 crops), including tomato, potato, maize, and chilli. Rice, cotton, wheat, and sugarcane can still have cases and advice, but a photo of those crops is returned as uncertain.

Until you train a model, every photo is uncertain and no disease is confirmed. That is intentional.

```powershell
pip install -r requirements-ml.txt
python -m ml.train --data C:\path\to\PlantVillage
```

Training writes `models/plantvillage_mobilenet.keras` and `models/metrics.json` only after a real evaluation. If the dataset is missing, the script exits without scores.

## Boundaries

- Chat refuses pesticide dose, mixing, frequency, and substitution questions.
- Chemical text on a confirmed diagnosis is a copied label reference, not a generated prescription.
- Follow-up status is only `improving`, `stable`, `worsening`, `inconclusive`, or `retake`.
- A photo cannot close a case. Closing needs confirmation and a no-new-symptoms checklist.
- Weather comes from the free Open-Meteo API. Shop stock and prices are a static Mandya reference list.
- SMS and WhatsApp are not sent. A forgot-password OTP is stored locally and returned in the response for the demo.

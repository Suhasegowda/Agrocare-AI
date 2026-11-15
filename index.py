import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "backend"))

if os.environ.get("VERCEL"):
    os.environ.setdefault("DATABASE_URL", "sqlite:////tmp/agrocare.db")
    os.environ.setdefault("UPLOAD_DIR", "/tmp/agrocare-uploads")

from fastapi import FastAPI

from app.main import app as api
from app.main import lifespan

app = FastAPI(title="AgroCare AI", lifespan=lifespan)
app.mount("/api", api)

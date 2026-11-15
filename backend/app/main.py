from contextlib import asynccontextmanager
from io import BytesIO

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageDraw

from app.config import settings
from app.database import SessionLocal, engine
from app.models import Base
from app.routers import auth, care, cases, diagnosis, platform
from app.seed import seed_if_empty


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(title="AgroCare AI", version="1.0.0", lifespan=lifespan, docs_url=None, redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(diagnosis.router)
app.include_router(cases.router)
app.include_router(care.router)
app.include_router(platform.router)
settings.upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(settings.upload_dir)), name="uploads")


def _favicon_png() -> bytes:
    image = Image.new("RGBA", (32, 32), (22, 101, 52, 255))
    ImageDraw.Draw(image).ellipse((7, 7, 25, 25), fill=(34, 197, 94, 255))
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


FAVICON_PNG = _favicon_png()

DOCS_STYLE = """
<meta name="color-scheme" content="light">
<style>
  html, body { background: #f8fafc !important; color: #0f172a !important; }
  .swagger-ui { background: #f8fafc; }
  .swagger-ui .info .title,
  .swagger-ui .info .title small,
  .swagger-ui .info p,
  .swagger-ui .info li,
  .swagger-ui .scheme-container { color: #0f172a; }
  .swagger-ui .info .title { color: #166534; }
</style>
"""


@app.get("/", include_in_schema=False)
def root():
    weights = "loaded" if settings.weights_path.exists() else "not trained yet"
    return HTMLResponse(
        f"""<!DOCTYPE html>
<html>
<head>
  <meta name="color-scheme" content="light">
  <title>AgroCare AI API</title>
  <style>
    body {{ margin: 0; font-family: "Segoe UI", sans-serif; background: #f8fafc; color: #0f172a; }}
    main {{ max-width: 680px; margin: 48px auto; padding: 32px; background: white; border: 1px solid #e2e8f0; border-radius: 16px; }}
    h1 {{ color: #166534; margin-top: 0; }}
    a {{ color: #166534; font-weight: 700; }}
  </style>
</head>
<body>
  <main>
    <h1>AgroCare AI API</h1>
    <p>This address is the backend. The farmer screens stay in the React app and are not served from port 8000.</p>
    <p><a href="/docs">Open the API reference</a></p>
    <p>Classifier weights are {weights}. Until a model is trained, an uploaded leaf is stored and returned as uncertain instead of a disease name.</p>
  </main>
</body>
</html>"""
    )


@app.get("/docs", include_in_schema=False)
def swagger_docs():
    page = get_swagger_ui_html(openapi_url="/openapi.json", title="AgroCare AI API")
    html = page.body.decode("utf-8").replace("<head>", "<head>" + DOCS_STYLE, 1)
    return HTMLResponse(html)


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(content=FAVICON_PNG, media_type="image/png")


@app.get("/health", include_in_schema=False)
def health():
    return {
        "service": "AgroCare AI",
        "docs": "/docs",
        "weightsPresent": settings.weights_path.exists(),
    }

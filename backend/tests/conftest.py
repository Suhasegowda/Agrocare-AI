import os
import tempfile
from io import BytesIO
from pathlib import Path

from PIL import Image

_upload = tempfile.mkdtemp(prefix="agrocare-uploads-")
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["JWT_SECRET"] = "test-secret-key-for-agrocare-suite"
os.environ["UPLOAD_DIR"] = _upload
os.environ["WEIGHTS_PATH"] = str(Path(_upload) / "missing.keras")

from fastapi.testclient import TestClient

from app.main import app


def noise_png() -> bytes:
    image = Image.new("RGB", (96, 96))
    pixels = [((index * 13) % 255, (index * 7) % 255, (index * 3) % 255) for index in range(96 * 96)]
    image.putdata(pixels)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def flat_png() -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (96, 96), (10, 120, 40)).save(buffer, format="PNG")
    return buffer.getvalue()


def client():
    with TestClient(app) as test_client:
        yield test_client


import pytest

@pytest.fixture()
def api():
    yield from client()

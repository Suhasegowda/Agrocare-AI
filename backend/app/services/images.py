import uuid
from io import BytesIO
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError

from app.config import settings

MAX_BYTES = 8 * 1024 * 1024
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}


def sharpness_score(image: Image.Image) -> float:
    small = image.convert("L").resize((64, 64))
    pixels = list(small.get_flattened_data())
    width = 64
    total = 0
    count = 0
    for y in range(width):
        row = y * width
        for x in range(width - 1):
            total += abs(pixels[row + x] - pixels[row + x + 1])
            count += 1
    return total / count


def is_blurry(image: Image.Image) -> bool:
    return sharpness_score(image) < 8.0


def save_upload(upload: UploadFile, owner_id: int) -> tuple[Path, Image.Image, str]:
    raw = upload.file.read()
    if not raw:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Empty file. Upload a JPEG, PNG, or WEBP leaf photo.")
    if len(raw) > MAX_BYTES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Image is larger than 8 MB.")
    try:
        probe = Image.open(BytesIO(raw))
        probe.verify()
        image = Image.open(BytesIO(raw))
        image.load()
    except (UnidentifiedImageError, OSError, SyntaxError) as exc:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Unsupported or corrupt file. Only JPEG, PNG, and WEBP images are accepted.",
        ) from exc
    if image.format not in ALLOWED_FORMATS:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Unsupported file type. Only JPEG, PNG, and WEBP images are accepted.",
        )
    if image.width < 32 or image.height < 32:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Image is too small to inspect.")

    folder = settings.upload_dir / f"user_{owner_id}"
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{uuid.uuid4().hex}.jpg"
    rgb = image.convert("RGB")
    rgb.save(path, "JPEG", quality=90)
    return path, rgb, public_url(path)


def public_url(path: Path) -> str:
    relative = path.resolve().relative_to(settings.upload_dir.resolve()).as_posix()
    return f"/uploads/{relative}"

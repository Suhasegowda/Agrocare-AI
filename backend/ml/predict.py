import json
from pathlib import Path

from PIL import Image

from app.config import settings
from ml.labels import CLASSES, model_covers, normalize_crop_id


def uncertain_result(message: str, *, model_loaded: bool = False, top: dict | None = None) -> dict:
    return {
        "confirmed": False,
        "uncertain": True,
        "disease": None,
        "pathogen": None,
        "pathogenType": None,
        "confidence": None,
        "healthyClass": False,
        "modelLoaded": model_loaded,
        "message": message,
        "gradCamPath": None,
        "topCandidate": top,
        "folder": None,
        "confidenceMeaning": "No disease is confirmed for this image.",
    }


def load_class_order() -> list[dict] | None:
    if not settings.labels_path.exists():
        return list(CLASSES)
    saved = json.loads(settings.labels_path.read_text(encoding="utf-8"))
    by_folder = {item["folder"]: item for item in CLASSES}
    if len(saved) != len(CLASSES) or any(folder not in by_folder for folder in saved):
        return None
    return [by_folder[folder] for folder in saved]


def predict_leaf(image_path: Path, crop_id: str, blurry: bool) -> dict:
    crop_id = normalize_crop_id(crop_id)
    if blurry:
        return uncertain_result("The photo is too blurry to classify. Retake a sharp photo of one leaf. No disease is confirmed.")
    if not model_covers(crop_id):
        return uncertain_result(
            "This crop has no class in the PlantVillage image set. The photo was saved, but no disease is confirmed."
        )
    if not settings.weights_path.exists():
        return uncertain_result(
            "Classifier weights are not on this machine yet. The photo was saved, but no disease is confirmed."
        )
    try:
        import numpy as np
        import tensorflow as tf
    except ImportError:
        return uncertain_result(
            "TensorFlow is not installed, so the classifier did not run. No disease is confirmed."
        )

    order = load_class_order()
    if order is None:
        return uncertain_result("The saved label file does not match this build. No disease is confirmed.")

    try:
        model = tf.keras.models.load_model(settings.weights_path)
        image = Image.open(image_path).convert("RGB").resize((224, 224))
        batch = np.expand_dims(np.asarray(image, dtype="float32"), 0)
        probabilities = model.predict(batch, verbose=0)[0]
    except Exception:
        return uncertain_result("The classifier could not read this photo or its weights. No disease is confirmed.")

    if len(probabilities) != len(order):
        return uncertain_result(
            "The model output does not match the 38-class label list. No disease is confirmed.",
            model_loaded=True,
        )

    index = int(probabilities.argmax())
    confidence = round(float(probabilities[index]) * 100, 1)
    chosen = order[index]
    candidate = {"disease": chosen["disease"], "confidence": confidence, "verified": False, "folder": chosen["folder"]}

    if chosen["cropId"] != crop_id or confidence < settings.confidence_threshold:
        reason = (
            "The top class does not match the crop you selected."
            if chosen["cropId"] != crop_id
            else "Confidence is below 70, so the class is not confirmed."
        )
        return uncertain_result(f"{reason} No disease is confirmed.", model_loaded=True, top=candidate)

    grad_path = None
    try:
        grad_path = write_gradcam(model, batch, index, image, image_path)
    except Exception:
        grad_path = None

    meaning = "Softmax score for this image. It is not a field-accuracy claim."
    if settings.metrics_path.exists():
        meaning += " A separate metrics file exists from training and is not this image's score."

    return {
        "confirmed": True,
        "uncertain": False,
        "disease": chosen["disease"],
        "pathogen": chosen["pathogen"],
        "pathogenType": chosen["pathogenType"],
        "confidence": confidence,
        "healthyClass": chosen["healthy"],
        "modelLoaded": True,
        "message": (
            "The model class is a healthy leaf. That is not proof the plant is cured and it cannot close a case."
            if chosen["healthy"]
            else "The classifier named this class above the confirmation threshold. It is not a laboratory diagnosis."
        ),
        "gradCamPath": grad_path,
        "topCandidate": None,
        "folder": chosen["folder"],
        "confidenceMeaning": meaning,
    }


def _find_layer(model, names: tuple[str, ...]):
    for name in names:
        try:
            return model.get_layer(name)
        except ValueError:
            continue
    for layer in getattr(model, "layers", []):
        if hasattr(layer, "get_layer"):
            found = _find_layer(layer, names)
            if found is not None:
                return found
    return None


def write_gradcam(model, batch, class_index: int, original: Image.Image, image_path: Path):
    import tensorflow as tf

    conv_layer = _find_layer(model, ("out_relu", "Conv_1"))
    if conv_layer is None:
        return None

    grad_model = tf.keras.Model(model.inputs, [conv_layer.output, model.output])
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(batch)
        loss = predictions[:, class_index]
    grads = tape.gradient(loss, conv_outputs)
    weights = tf.reduce_mean(grads, axis=(1, 2))
    cam = tf.reduce_sum(tf.nn.relu(weights[:, None, None, :] * conv_outputs), axis=-1)
    cam = cam[0]
    cam = cam / (tf.reduce_max(cam) + 1e-8)
    heat = (cam.numpy() * 255).astype("uint8")
    heat_image = Image.fromarray(heat, mode="L").resize(original.size)
    color = Image.new("RGBA", original.size)
    color.putdata([(255, max(0, 255 - value), 0, int(value * 0.45)) for value in heat_image.get_flattened_data()])
    composed = Image.alpha_composite(original.convert("RGBA"), color).convert("RGB")
    out = image_path.with_name(image_path.stem + "-gradcam.jpg")
    composed.save(out, "JPEG", quality=85)
    return out

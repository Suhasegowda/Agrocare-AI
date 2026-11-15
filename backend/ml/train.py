"""Train MobileNetV2 on a local PlantVillage folder.

The script writes model weights and metrics only after evaluation finishes.
If the dataset or TensorFlow is missing, it exits without inventing scores.

Example:
    python -m ml.train --data "C:\\data\\PlantVillage"
"""

import argparse
import json
import random
import sys
from pathlib import Path

from ml.labels import CLASSES


def resolve_root(path: Path) -> Path:
    if (path / "Tomato___healthy").is_dir():
        return path
    for sub in ("color", "PlantVillage", "plantvillage"):
        candidate = path / sub
        if (candidate / "Tomato___healthy").is_dir():
            return candidate
    return path


def collect_split(root: Path, seed: int, val_ratio: float = 0.2):
    rng = random.Random(seed)
    train, val = [], []
    counts = {}
    for index, item in enumerate(CLASSES):
        folder = root / item["folder"]
        files = [
            path
            for path in folder.iterdir()
            if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        ]
        files.sort(key=lambda item_path: item_path.name)
        rng.shuffle(files)
        if len(files) < 2:
            raise RuntimeError(f"{item['folder']} needs at least 2 images to split. Found {len(files)}.")
        cut = max(1, int(len(files) * val_ratio))
        if cut >= len(files):
            cut = len(files) - 1
        val_files = files[:cut]
        train_files = files[cut:]
        train.extend((str(path), index) for path in train_files)
        val.extend((str(path), index) for path in val_files)
        counts[item["folder"]] = {"train": len(train_files), "validation": len(val_files)}
    rng.shuffle(train)
    rng.shuffle(val)
    return train, val, counts


def main() -> int:
    parser = argparse.ArgumentParser(description="Train the AgroCare PlantVillage classifier")
    parser.add_argument("--data", required=True, help="Path to the PlantVillage color folder")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    root = resolve_root(Path(args.data))
    missing = [item["folder"] for item in CLASSES if not (root / item["folder"]).is_dir()]
    if missing:
        print("Dataset is incomplete. No metrics were written.")
        print(f"Missing {len(missing)} class folders under {root}.")
        return 1

    try:
        import tensorflow as tf
        from sklearn.metrics import confusion_matrix, f1_score, recall_score
    except ImportError:
        print("TensorFlow or scikit-learn is not installed. No metrics were written.")
        return 1

    try:
        train_items, val_items, counts = collect_split(root, args.seed)
    except RuntimeError as exc:
        print(f"{exc} No metrics were written.")
        return 1

    tf.keras.utils.set_random_seed(args.seed)
    num_classes = len(CLASSES)

    def decode(path, label):
        raw = tf.io.read_file(path)
        image = tf.io.decode_image(raw, channels=3, expand_animations=False)
        image = tf.image.resize(image, (224, 224))
        image = tf.cast(image, tf.float32)
        return image, tf.one_hot(label, num_classes)

    def augment(image, label):
        image = tf.image.random_flip_left_right(image)
        image = tf.image.random_flip_up_down(image)
        return image, label

    train_ds = tf.data.Dataset.from_tensor_slices(
        ([item[0] for item in train_items], [item[1] for item in train_items])
    )
    val_ds = tf.data.Dataset.from_tensor_slices(
        ([item[0] for item in val_items], [item[1] for item in val_items])
    )
    train_ds = (
        train_ds.shuffle(min(1000, len(train_items)), seed=args.seed)
        .map(decode, num_parallel_calls=tf.data.AUTOTUNE)
        .map(augment, num_parallel_calls=tf.data.AUTOTUNE)
        .batch(args.batch_size)
        .prefetch(tf.data.AUTOTUNE)
    )
    val_ds = val_ds.map(decode, num_parallel_calls=tf.data.AUTOTUNE).batch(args.batch_size).prefetch(tf.data.AUTOTUNE)

    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = tf.keras.layers.Rescaling(scale=1 / 127.5, offset=-1, name="preprocess")(inputs)
    base = tf.keras.applications.MobileNetV2(include_top=False, weights="imagenet", input_tensor=x)
    base.trainable = False
    pooled = tf.keras.layers.GlobalAveragePooling2D()(base.output)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax", name="predictions")(pooled)
    model = tf.keras.Model(inputs, outputs)
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-3), loss="categorical_crossentropy", metrics=["accuracy"])

    model.fit(train_ds, validation_data=val_ds, epochs=args.epochs)

    y_true = []
    y_pred = []
    for images, labels in val_ds:
        probs = model.predict(images, verbose=0)
        y_true.extend(labels.numpy().argmax(axis=1).tolist())
        y_pred.extend(probs.argmax(axis=1).tolist())

    labels_index = list(range(num_classes))
    matrix = confusion_matrix(y_true, y_pred, labels=labels_index).tolist()
    per_class = recall_score(y_true, y_pred, labels=labels_index, average=None, zero_division=0).tolist()
    macro_f1 = float(f1_score(y_true, y_pred, labels=labels_index, average="macro", zero_division=0))

    out_dir = Path(__file__).resolve().parent.parent / "models"
    out_dir.mkdir(parents=True, exist_ok=True)
    model_path = out_dir / "plantvillage_mobilenet.keras"
    model.save(model_path)
    (out_dir / "labels.json").write_text(
        json.dumps([item["folder"] for item in CLASSES], indent=2),
        encoding="utf-8",
    )
    metrics = {
        "trained": True,
        "seed": args.seed,
        "epochs": args.epochs,
        "augmentation": ["random_flip_left_right", "random_flip_up_down"],
        "split": "stratified by class folder, shuffled with the recorded seed, no file in both splits",
        "classCounts": counts,
        "macroF1": round(macro_f1, 4),
        "perClassRecall": {
            CLASSES[index]["folder"]: round(float(score), 4) for index, score in enumerate(per_class)
        },
        "confusionMatrix": matrix,
        "modelVersion": "mobilenetv2-plantvillage-v1",
        "note": "Scores describe this held-out split only. They are not a field-image result unless the folder itself is field photos.",
    }
    (out_dir / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Saved {model_path}")
    print(f"Macro F1 on the held-out split: {metrics['macroF1']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

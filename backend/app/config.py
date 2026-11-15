import os
from pathlib import Path


class Settings:
    def __init__(self) -> None:
        self.base_dir = Path(__file__).resolve().parent.parent
        self.database_url = os.environ.get(
            "DATABASE_URL", f"sqlite:///{self.base_dir / 'agrocare.db'}"
        )
        self.upload_dir = Path(os.environ.get("UPLOAD_DIR", self.base_dir / "uploads"))
        self.weights_path = Path(
            os.environ.get(
                "WEIGHTS_PATH",
                self.base_dir / "models" / "plantvillage_mobilenet.keras",
            )
        )
        self.labels_path = self.weights_path.parent / "labels.json"
        self.metrics_path = self.weights_path.parent / "metrics.json"
        self.jwt_secret = os.environ.get("JWT_SECRET", "agrocare-dev-secret-change-before-any-public-demo")
        self.jwt_algorithm = "HS256"
        self.token_days = 7
        self.confidence_threshold = 70.0


settings = Settings()

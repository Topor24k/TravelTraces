from __future__ import annotations

import os
from dataclasses import dataclass


def _csv_env(name: str, default: str) -> list[str]:
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "TravelPlaces Mapping API")
    app_env: str = os.getenv("APP_ENV", "local")
    cors_origins: list[str] = None  # type: ignore[assignment]
    osrm_url: str = os.getenv("OSRM_URL", "https://router.project-osrm.org")
    nominatim_url: str = os.getenv("NOMINATIM_URL", "https://nominatim.openstreetmap.org")
    photon_url: str = os.getenv("PHOTON_URL", "https://photon.komoot.io")
    region_hint: str = os.getenv("REGION_HINT", "Southeast Asia")
    max_request_bytes: int = int(os.getenv("MAX_REQUEST_BYTES", str(16 * 1024 * 1024)))
    chat_model_url: str | None = os.getenv("CHAT_MODEL_URL")
    chat_model_api_key: str | None = os.getenv("CHAT_MODEL_API_KEY")
    chat_model_timeout_s: float = float(os.getenv("CHAT_MODEL_TIMEOUT_S", "60"))

    def __post_init__(self) -> None:
        if self.cors_origins is None:
            object.__setattr__(
                self,
                "cors_origins",
                _csv_env("API_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"),
            )


settings = Settings()

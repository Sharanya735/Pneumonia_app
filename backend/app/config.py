# app/config.py
from pathlib import Path
from typing import List
from functools import lru_cache
from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # General
    APP_NAME: str = "pneumonia-api"
    ENV: str = "dev"
    PORT: int = 8000

    # Database
    DATABASE_URL: str

    # JWT / Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # File paths
    UPLOAD_DIR: str = str(BASE_DIR / "uploads" / "scans")
    MODEL_PATH: str = str(BASE_DIR / "ml" / "chest_xray_cnn_model.keras")

    # CORS (optional)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"


# Singleton settings instance
@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

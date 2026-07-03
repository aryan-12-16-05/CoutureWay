"""Application configuration, loaded from environment (.env supported)."""
import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_EXPIRES = timedelta(hours=int(os.getenv("JWT_EXPIRES_HOURS", "72")))

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'coutureway.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CORS_ORIGINS = [
        o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",") if o.strip()
    ]

    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").strip().lower()

    DEBUG = os.getenv("FLASK_ENV", "production") == "development"


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


def get_config():
    return DevelopmentConfig if os.getenv("FLASK_ENV") == "development" else ProductionConfig

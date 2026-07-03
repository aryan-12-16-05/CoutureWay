"""Shared Flask extension instances (kept separate to avoid circular imports)."""
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()

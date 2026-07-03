"""JWT encode/decode helpers."""
from datetime import datetime, timezone

import jwt
from flask import current_app


def create_access_token(user_id: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + current_app.config["JWT_EXPIRES"],
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def decode_access_token(token: str) -> str | None:
    """Return the user id, or None if the token is invalid/expired."""
    try:
        payload = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None

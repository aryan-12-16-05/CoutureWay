"""JWT authentication guards for protected routes."""
from functools import wraps

from flask import g, request

from ..models import AppRole, User
from ..utils.responses import error
from ..utils.tokens import decode_access_token


def _load_user_from_request():
    auth = request.headers.get("Authorization", "")
    if not auth.lower().startswith("bearer "):
        return None
    token = auth[7:].strip()
    if not token:
        return None
    user_id = decode_access_token(token)
    if not user_id:
        return None
    return User.query.get(user_id)


def auth_required(fn):
    """Reject the request with 401 unless a valid JWT identifies a user."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = _load_user_from_request()
        if user is None:
            return error("Unauthorized", 401)
        g.current_user = user
        return fn(*args, **kwargs)

    return wrapper


def admin_required(fn):
    """Reject with 401 (no user) or 403 (not an admin)."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = _load_user_from_request()
        if user is None:
            return error("Unauthorized", 401)
        if not user.has_role(AppRole.admin):
            return error("Forbidden", 403)
        g.current_user = user
        return fn(*args, **kwargs)

    return wrapper

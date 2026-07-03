"""Profile endpoints."""
from flask import Blueprint, g, request

from ..extensions import db
from ..middleware.auth import auth_required
from ..schemas.validators import ValidationError, validate_profile_update
from ..utils.responses import error, ok

profile_bp = Blueprint("profile", __name__)


@profile_bp.get("/profile")
@auth_required
def get_profile():
    p = g.current_user.profile
    return ok(p.to_dict() if p else None)


@profile_bp.put("/profile")
@auth_required
def update_profile():
    body = request.get_json(silent=True)
    if body is None:
        return error("Invalid JSON body", 400)
    try:
        data = validate_profile_update(body)
    except ValidationError as e:
        return error("Validation failed", 422, e.details)
    p = g.current_user.profile
    if p is None:
        return error("Profile not found", 404)
    for k, v in data.items():
        setattr(p, k, v)
    db.session.commit()
    return ok(p.to_dict())

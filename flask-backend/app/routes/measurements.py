"""Measurement endpoints — single 'Primary' record per user, upsert semantics."""
from flask import Blueprint, g, request

from ..extensions import db
from ..middleware.auth import auth_required
from ..models import Measurement
from ..schemas.validators import ValidationError, validate_measurements
from ..utils.responses import error, ok

measurements_bp = Blueprint("measurements", __name__)


@measurements_bp.get("/measurements")
@auth_required
def get_measurements():
    label = request.args.get("label", "Primary")
    m = Measurement.query.filter_by(user_id=g.current_user.id, label=label).first()
    return ok(m.to_dict() if m else None)


@measurements_bp.put("/measurements")
@auth_required
def upsert_measurements():
    body = request.get_json(silent=True)
    if body is None:
        return error("Invalid JSON body", 400)
    try:
        data = validate_measurements(body)
    except ValidationError as e:
        return error("Validation failed", 422, e.details)
    label = data.pop("label")
    m = Measurement.query.filter_by(user_id=g.current_user.id, label=label).first()
    if m is None:
        m = Measurement(user_id=g.current_user.id, label=label)
        db.session.add(m)
    for k, v in data.items():
        setattr(m, k, v)
    db.session.commit()
    return ok(m.to_dict())

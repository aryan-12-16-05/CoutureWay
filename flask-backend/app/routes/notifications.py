"""Notification endpoints."""
from datetime import datetime, timezone

from flask import Blueprint, g, request

from ..extensions import db
from ..middleware.auth import auth_required
from ..models import Notification
from ..utils.responses import error, ok

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.get("/notifications")
@auth_required
def list_notifications():
    try:
        limit = min(int(request.args.get("limit", 20)), 100)
    except ValueError:
        limit = 20
    rows = (
        Notification.query.filter_by(user_id=g.current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )
    return ok([n.to_dict() for n in rows])


@notifications_bp.get("/notifications/unread-count")
@auth_required
def unread_count():
    count = Notification.query.filter_by(user_id=g.current_user.id, read_at=None).count()
    return ok({"count": count})


@notifications_bp.patch("/notifications/<notif_id>/read")
@auth_required
def mark_read(notif_id):
    n = Notification.query.filter_by(id=notif_id, user_id=g.current_user.id).first()
    if n is None:
        return error("Notification not found", 404)
    n.read_at = datetime.now(timezone.utc)
    db.session.commit()
    return ok(n.to_dict())


@notifications_bp.post("/notifications/read-all")
@auth_required
def mark_all_read():
    now = datetime.now(timezone.utc)
    Notification.query.filter_by(user_id=g.current_user.id, read_at=None).update(
        {"read_at": now}
    )
    db.session.commit()
    return ok({"read": True})

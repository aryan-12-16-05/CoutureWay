"""Appointment endpoints — parity with the old TanStack API route + dashboard."""
from flask import Blueprint, g, request

from ..extensions import db
from ..middleware.auth import auth_required
from ..models import Appointment, AppointmentStatus
from ..schemas.validators import ValidationError, validate_appointment
from ..services.notification_service import notify_appointment_created
from ..utils.responses import created, error, ok

appointments_bp = Blueprint("appointments", __name__)


@appointments_bp.get("/appointments")
@auth_required
def list_appointments():
    order = request.args.get("order", "asc")
    col = Appointment.scheduled_date.desc() if order == "desc" else Appointment.scheduled_date.asc()
    rows = Appointment.query.filter_by(user_id=g.current_user.id).order_by(col).all()
    return ok([a.to_dict() for a in rows])


@appointments_bp.post("/appointments")
@auth_required
def create_appointment():
    body = request.get_json(silent=True)
    if body is None:
        return error("Invalid JSON body", 400)
    try:
        data = validate_appointment(body)
    except ValidationError as e:
        return error("Validation failed", 422, e.details)
    appt = Appointment(user_id=g.current_user.id, status=AppointmentStatus.confirmed, **data)
    db.session.add(appt)
    db.session.flush()
    notify_appointment_created(appt)
    db.session.commit()
    return created(appt.to_dict())


@appointments_bp.patch("/appointments/<appt_id>")
@auth_required
def update_appointment(appt_id):
    appt = Appointment.query.filter_by(id=appt_id, user_id=g.current_user.id).first()
    if appt is None:
        return error("Appointment not found", 404)
    body = request.get_json(silent=True) or {}
    status = body.get("status")
    if status:
        valid = {s.value for s in AppointmentStatus}
        if status not in valid:
            return error(f"Invalid status '{status}'", 422)
        appt.status = AppointmentStatus(status)
    if "notes" in body:
        appt.notes = body["notes"]
    db.session.commit()
    return ok(appt.to_dict())


@appointments_bp.delete("/appointments/<appt_id>")
@auth_required
def delete_appointment(appt_id):
    appt = Appointment.query.filter_by(id=appt_id, user_id=g.current_user.id).first()
    if appt is None:
        return error("Appointment not found", 404)
    db.session.delete(appt)
    db.session.commit()
    return ok({"deleted": True})

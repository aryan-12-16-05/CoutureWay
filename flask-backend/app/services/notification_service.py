"""Replicates the old Postgres notification triggers in the service layer."""
from ..extensions import db
from ..models import Notification


def notify_appointment_created(appointment):
    db.session.add(
        Notification(
            user_id=appointment.user_id,
            title="Appointment confirmed",
            body=(
                f"Your {appointment.service} session is reserved for "
                f"{appointment.scheduled_date.isoformat()} at {appointment.scheduled_time}."
            ),
            kind="appointment",
            link="/dashboard",
        )
    )


def notify_order_status(order):
    db.session.add(
        Notification(
            user_id=order.user_id,
            title=f"Order {order.order_number} — {order.status.value}",
            body=f"Your order status has been updated to {order.status.value}.",
            kind="order",
            link="/dashboard",
        )
    )

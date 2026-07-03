"""Order creation and status transitions."""
from ..extensions import db
from ..models import Order, OrderItem, OrderStatus
from .notification_service import notify_order_status

VALID_STATUSES = {s.value for s in OrderStatus}


def create_order(user, payload) -> Order:
    subtotal = sum(i["unit_price_cents"] * i["quantity"] for i in payload["items"])
    order = Order(
        user_id=user.id,
        subtotal_cents=subtotal,
        total_cents=subtotal,
        shipping_address=payload.get("shipping_address"),
        customer_email=user.email,
        customer_name=user.profile.full_name if user.profile else None,
        notes=payload.get("notes"),
    )
    db.session.add(order)
    db.session.flush()
    for i in payload["items"]:
        db.session.add(OrderItem(order_id=order.id, **i))
    notify_order_status(order)
    db.session.commit()
    return order


def update_status(order: Order, status_value: str) -> Order:
    if status_value not in VALID_STATUSES:
        raise ValueError(f"Invalid status '{status_value}'")
    changed = order.status.value != status_value
    order.status = OrderStatus(status_value)
    if changed:
        notify_order_status(order)
    db.session.commit()
    return order

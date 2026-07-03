"""Order endpoints — users manage their own orders; admins update status."""
from flask import Blueprint, g, request

from ..middleware.auth import admin_required, auth_required
from ..models import Order
from ..schemas.validators import ValidationError, validate_order_create
from ..services import order_service
from ..utils.responses import created, error, ok

orders_bp = Blueprint("orders", __name__)


@orders_bp.get("/orders")
@auth_required
def list_orders():
    orders = (
        Order.query.filter_by(user_id=g.current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return ok([o.to_dict() for o in orders])


@orders_bp.get("/orders/<order_id>")
@auth_required
def get_order(order_id):
    o = Order.query.filter_by(id=order_id, user_id=g.current_user.id).first()
    if o is None:
        return error("Order not found", 404)
    return ok(o.to_dict())


@orders_bp.post("/orders")
@auth_required
def create_order():
    body = request.get_json(silent=True)
    if body is None:
        return error("Invalid JSON body", 400)
    try:
        payload = validate_order_create(body)
    except ValidationError as e:
        return error("Validation failed", 422, e.details)
    order = order_service.create_order(g.current_user, payload)
    return created(order.to_dict())


@orders_bp.patch("/orders/<order_id>")
@admin_required
def update_order(order_id):
    o = Order.query.get(order_id)
    if o is None:
        return error("Order not found", 404)
    body = request.get_json(silent=True) or {}
    status = body.get("status")
    if not status:
        return error("'status' is required", 422)
    try:
        o = order_service.update_status(o, status)
    except ValueError as e:
        return error(str(e), 422)
    return ok(o.to_dict())

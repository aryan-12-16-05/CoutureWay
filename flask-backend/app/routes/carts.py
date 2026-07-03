"""Cart endpoints (schema parity with the old carts/cart_items tables)."""
from flask import Blueprint, g, request

from ..extensions import db
from ..middleware.auth import auth_required
from ..models import Cart, CartItem, Product
from ..utils.responses import created, error, ok

carts_bp = Blueprint("carts", __name__)


def _get_or_create_cart():
    cart = Cart.query.filter_by(user_id=g.current_user.id).first()
    if cart is None:
        cart = Cart(user_id=g.current_user.id)
        db.session.add(cart)
        db.session.commit()
    return cart


@carts_bp.get("/cart")
@auth_required
def get_cart():
    return ok(_get_or_create_cart().to_dict())


@carts_bp.post("/cart/items")
@auth_required
def add_item():
    cart = _get_or_create_cart()
    body = request.get_json(silent=True) or {}
    product = Product.query.get(body.get("product_id")) if body.get("product_id") else None
    name = body.get("name") or (product.name if product else None)
    price = body.get("unit_price_cents", product.price_cents if product else None)
    qty = body.get("quantity", 1)
    if not name or not isinstance(price, int) or price < 0:
        return error("'name' and non-negative integer 'unit_price_cents' are required", 422)
    if not isinstance(qty, int) or qty <= 0:
        return error("'quantity' must be a positive integer", 422)
    item = CartItem(
        cart_id=cart.id,
        product_id=product.id if product else None,
        name=name,
        unit_price_cents=price,
        quantity=qty,
        customization=body.get("customization") or {},
    )
    db.session.add(item)
    db.session.commit()
    return created(item.to_dict())


@carts_bp.patch("/cart/items/<item_id>")
@auth_required
def update_item(item_id):
    cart = _get_or_create_cart()
    item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
    if item is None:
        return error("Cart item not found", 404)
    body = request.get_json(silent=True) or {}
    if "quantity" in body:
        if not isinstance(body["quantity"], int) or body["quantity"] <= 0:
            return error("'quantity' must be a positive integer", 422)
        item.quantity = body["quantity"]
    if "customization" in body:
        item.customization = body["customization"] or {}
    db.session.commit()
    return ok(item.to_dict())


@carts_bp.delete("/cart/items/<item_id>")
@auth_required
def delete_item(item_id):
    cart = _get_or_create_cart()
    item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
    if item is None:
        return error("Cart item not found", 404)
    db.session.delete(item)
    db.session.commit()
    return ok({"deleted": True})

"""Product endpoints — public read, admin write."""
from flask import Blueprint, request

from ..extensions import db
from ..middleware.auth import admin_required
from ..models import Product
from ..schemas.validators import ValidationError, validate_product
from ..utils.responses import created, error, ok

products_bp = Blueprint("products", __name__)


@products_bp.get("/products")
def list_products():
    """GET /api/products?category=xxx&limit=50 — same contract as the old route."""
    category = request.args.get("category")
    try:
        limit = min(int(request.args.get("limit", 100)), 200)
    except ValueError:
        limit = 100
    q = Product.query.filter_by(active=True).order_by(Product.created_at.desc()).limit(limit)
    if category:
        q = Product.query.filter_by(active=True, category=category).order_by(
            Product.created_at.desc()
        ).limit(limit)
    return ok([p.to_dict() for p in q.all()])


@products_bp.get("/products/<product_id>")
def get_product(product_id):
    p = Product.query.filter_by(id=product_id, active=True).first()
    if p is None:
        return error("Product not found", 404)
    return ok(p.to_dict())


@products_bp.post("/products")
@admin_required
def create_product():
    body = request.get_json(silent=True)
    if body is None:
        return error("Invalid JSON body", 400)
    try:
        data = validate_product(body)
    except ValidationError as e:
        return error("Validation failed", 422, e.details)
    if Product.query.filter_by(slug=data["slug"]).first():
        return error("A product with this slug already exists", 409)
    p = Product(**data)
    db.session.add(p)
    db.session.commit()
    return created(p.to_dict())


@products_bp.route("/products/<product_id>", methods=["PUT", "PATCH"])
@admin_required
def update_product(product_id):
    p = Product.query.get(product_id)
    if p is None:
        return error("Product not found", 404)
    body = request.get_json(silent=True)
    if body is None:
        return error("Invalid JSON body", 400)
    try:
        data = validate_product(body, partial=True)
    except ValidationError as e:
        return error("Validation failed", 422, e.details)
    if "slug" in data and data["slug"] != p.slug:
        if Product.query.filter_by(slug=data["slug"]).first():
            return error("A product with this slug already exists", 409)
    for k, v in data.items():
        setattr(p, k, v)
    db.session.commit()
    return ok(p.to_dict())


@products_bp.delete("/products/<product_id>")
@admin_required
def delete_product(product_id):
    p = Product.query.get(product_id)
    if p is None:
        return error("Product not found", 404)
    db.session.delete(p)
    db.session.commit()
    return ok({"deleted": True})

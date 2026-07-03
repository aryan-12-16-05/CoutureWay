"""Lightweight request validation (mirrors the old zod schemas)."""
import re
from datetime import date

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class ValidationError(Exception):
    def __init__(self, details):
        super().__init__("Validation failed")
        self.details = details


def _require_dict(body):
    if not isinstance(body, dict):
        raise ValidationError({"body": ["Expected a JSON object"]})
    return body


def _string(body, field, errors, *, required=True, min_len=1, max_len=5000):
    v = body.get(field)
    if v is None or v == "":
        if required:
            errors.setdefault(field, []).append("This field is required")
        return None
    if not isinstance(v, str):
        errors.setdefault(field, []).append("Must be a string")
        return None
    v = v.strip()
    if len(v) < min_len:
        errors.setdefault(field, []).append(f"Must be at least {min_len} characters")
    if len(v) > max_len:
        errors.setdefault(field, []).append(f"Must be at most {max_len} characters")
    return v


def validate_signup(body):
    body = _require_dict(body)
    errors = {}
    email = _string(body, "email", errors)
    password = _string(body, "password", errors, min_len=8, max_len=128)
    full_name = _string(body, "full_name", errors, required=False, max_len=255)
    if email and not EMAIL_RE.match(email):
        errors.setdefault("email", []).append("Invalid email address")
    if errors:
        raise ValidationError(errors)
    return {"email": email.lower(), "password": password, "full_name": full_name}


def validate_signin(body):
    body = _require_dict(body)
    errors = {}
    email = _string(body, "email", errors)
    password = _string(body, "password", errors, max_len=128)
    if errors:
        raise ValidationError(errors)
    return {"email": email.lower(), "password": password}


def validate_appointment(body):
    """Same contract as the old zod CreateSchema in src/routes/api/appointments.ts."""
    body = _require_dict(body)
    errors = {}
    data = {
        "service": _string(body, "service", errors, max_len=255),
        "scheduled_date": _string(body, "scheduled_date", errors),
        "scheduled_time": _string(body, "scheduled_time", errors, max_len=20),
        "full_name": _string(body, "full_name", errors, max_len=255),
        "email": _string(body, "email", errors, max_len=255),
        "address": _string(body, "address", errors),
        "phone": _string(body, "phone", errors, required=False, max_len=50),
        "notes": _string(body, "notes", errors, required=False),
    }
    if data["email"] and not EMAIL_RE.match(data["email"]):
        errors.setdefault("email", []).append("Invalid email address")
    if data["scheduled_date"]:
        if not DATE_RE.match(data["scheduled_date"]):
            errors.setdefault("scheduled_date", []).append("Expected YYYY-MM-DD")
        else:
            try:
                data["scheduled_date"] = date.fromisoformat(data["scheduled_date"])
            except ValueError:
                errors.setdefault("scheduled_date", []).append("Invalid calendar date")
    if errors:
        raise ValidationError(errors)
    return data


def validate_measurements(body):
    body = _require_dict(body)
    errors = {}
    fields = ("chest_cm", "waist_cm", "hips_cm", "sleeve_cm", "inseam_cm", "shoulder_cm", "neck_cm")
    out = {}
    for f in fields:
        v = body.get(f)
        if v in (None, ""):
            out[f] = None
            continue
        try:
            n = float(v)
            if n < 0 or n > 500:
                errors.setdefault(f, []).append("Out of range")
            else:
                out[f] = n
        except (TypeError, ValueError):
            errors.setdefault(f, []).append("Must be a number")
    out["notes"] = _string(body, "notes", errors, required=False)
    out["label"] = _string(body, "label", errors, required=False, max_len=120) or "Primary"
    if errors:
        raise ValidationError(errors)
    return out


def validate_profile_update(body):
    body = _require_dict(body)
    errors = {}
    allowed = ("full_name", "phone", "shipping_address", "city", "country", "postal_code", "avatar_url")
    out = {}
    for f in allowed:
        if f in body:
            out[f] = _string(body, f, errors, required=False, max_len=1000)
    if not out:
        raise ValidationError({"body": ["No updatable fields provided"]})
    if errors:
        raise ValidationError(errors)
    return out


def validate_order_create(body):
    body = _require_dict(body)
    errors = {}
    items = body.get("items")
    if not isinstance(items, list) or not items:
        raise ValidationError({"items": ["At least one order item is required"]})
    clean_items = []
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            errors.setdefault(f"items[{i}]", []).append("Expected an object")
            continue
        name = item.get("name")
        price = item.get("unit_price_cents")
        qty = item.get("quantity", 1)
        if not isinstance(name, str) or not name.strip():
            errors.setdefault(f"items[{i}].name", []).append("Required")
        if not isinstance(price, int) or price < 0:
            errors.setdefault(f"items[{i}].unit_price_cents", []).append("Must be a non-negative integer")
        if not isinstance(qty, int) or qty <= 0:
            errors.setdefault(f"items[{i}].quantity", []).append("Must be a positive integer")
        clean_items.append(
            {
                "product_id": item.get("product_id"),
                "name": (name or "").strip(),
                "unit_price_cents": price if isinstance(price, int) else 0,
                "quantity": qty if isinstance(qty, int) else 1,
                "customization": item.get("customization") or {},
            }
        )
    if errors:
        raise ValidationError(errors)
    return {
        "items": clean_items,
        "shipping_address": body.get("shipping_address"),
        "notes": body.get("notes"),
    }


def validate_product(body, partial=False):
    body = _require_dict(body)
    errors = {}
    out = {}
    for f, max_len in (("slug", 255), ("name", 255), ("category", 120), ("currency", 10)):
        required = not partial and f in ("slug", "name")
        v = _string(body, f, errors, required=required, max_len=max_len)
        if v is not None:
            out[f] = v
    for f in ("description", "image_url"):
        v = _string(body, f, errors, required=False)
        if v is not None:
            out[f] = v
    if "price_cents" in body or not partial:
        p = body.get("price_cents")
        if not isinstance(p, int) or p < 0:
            errors.setdefault("price_cents", []).append("Must be a non-negative integer")
        else:
            out["price_cents"] = p
    for f in ("is_custom", "active"):
        if f in body:
            if not isinstance(body[f], bool):
                errors.setdefault(f, []).append("Must be a boolean")
            else:
                out[f] = body[f]
    if errors:
        raise ValidationError(errors)
    return out

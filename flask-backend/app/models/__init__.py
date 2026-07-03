"""SQLAlchemy models mirroring the previous Supabase (Postgres) schema.

UUIDs are stored as 36-char strings so the same models run unchanged on
SQLite (dev) and PostgreSQL/MySQL (prod).
"""
import enum
import random
from datetime import datetime, timezone

from ..extensions import db
from ..utils.ids import new_uuid


def utcnow():
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------- enums ----
class AppRole(str, enum.Enum):
    admin = "admin"
    user = "user"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    in_production = "in_production"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"
    refunded = "refunded"


class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"


class TimestampMixin:
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow
    )


# ---------------------------------------------------------------- users ----
class User(TimestampMixin, db.Model):
    """Replaces Supabase's auth.users."""

    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    profile = db.relationship(
        "Profile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    roles = db.relationship("UserRole", back_populates="user", cascade="all, delete-orphan")
    cart = db.relationship("Cart", back_populates="user", uselist=False, cascade="all, delete-orphan")
    orders = db.relationship("Order", back_populates="user", cascade="all, delete-orphan")
    appointments = db.relationship(
        "Appointment", back_populates="user", cascade="all, delete-orphan"
    )
    measurements = db.relationship(
        "Measurement", back_populates="user", cascade="all, delete-orphan"
    )
    notifications = db.relationship(
        "Notification", back_populates="user", cascade="all, delete-orphan"
    )

    def has_role(self, role: AppRole) -> bool:
        return any(r.role == role for r in self.roles)

    def to_dict(self):
        return {"id": self.id, "email": self.email, "created_at": self.created_at.isoformat()}


class Profile(TimestampMixin, db.Model):
    __tablename__ = "profiles"

    id = db.Column(db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    email = db.Column(db.String(255))
    full_name = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    shipping_address = db.Column(db.Text)
    city = db.Column(db.String(120))
    country = db.Column(db.String(120))
    postal_code = db.Column(db.String(30))
    avatar_url = db.Column(db.Text)
    concierge_name = db.Column(db.String(120), default="Madeleine Laurent")

    user = db.relationship("User", back_populates="profile")

    UPDATABLE = ("full_name", "phone", "shipping_address", "city", "country", "postal_code", "avatar_url")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "phone": self.phone,
            "shipping_address": self.shipping_address,
            "city": self.city,
            "country": self.country,
            "postal_code": self.postal_code,
            "avatar_url": self.avatar_url,
            "concierge_name": self.concierge_name,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class UserRole(db.Model):
    __tablename__ = "user_roles"
    __table_args__ = (db.UniqueConstraint("user_id", "role", name="uq_user_role"),)

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    role = db.Column(db.Enum(AppRole), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)

    user = db.relationship("User", back_populates="roles")


# ------------------------------------------------------------- products ----
class Product(TimestampMixin, db.Model):
    __tablename__ = "products"
    __table_args__ = (db.CheckConstraint("price_cents >= 0", name="ck_price_nonneg"),)

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(120), index=True)
    price_cents = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.String(10), nullable=False, default="USD")
    image_url = db.Column(db.Text)
    stripe_price_id = db.Column(db.String(255))
    is_custom = db.Column(db.Boolean, nullable=False, default=False)
    active = db.Column(db.Boolean, nullable=False, default=True, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "price_cents": self.price_cents,
            "currency": self.currency,
            "image_url": self.image_url,
            "is_custom": self.is_custom,
            "active": self.active,
            "created_at": self.created_at.isoformat(),
        }


# ---------------------------------------------------------------- carts ----
class Cart(TimestampMixin, db.Model):
    __tablename__ = "carts"

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True
    )

    user = db.relationship("User", back_populates="cart")
    items = db.relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "items": [i.to_dict() for i in self.items],
        }


class CartItem(db.Model):
    __tablename__ = "cart_items"
    __table_args__ = (
        db.CheckConstraint("unit_price_cents >= 0", name="ck_cart_price_nonneg"),
        db.CheckConstraint("quantity > 0", name="ck_cart_qty_pos"),
    )

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    cart_id = db.Column(
        db.String(36), db.ForeignKey("carts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id = db.Column(db.String(36), db.ForeignKey("products.id", ondelete="SET NULL"))
    name = db.Column(db.String(255), nullable=False)
    unit_price_cents = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    customization = db.Column(db.JSON, nullable=False, default=dict)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)

    cart = db.relationship("Cart", back_populates="items")

    def to_dict(self):
        return {
            "id": self.id,
            "cart_id": self.cart_id,
            "product_id": self.product_id,
            "name": self.name,
            "unit_price_cents": self.unit_price_cents,
            "quantity": self.quantity,
            "customization": self.customization or {},
        }


# --------------------------------------------------------------- orders ----
def _order_number() -> str:
    return f"CW-{random.randint(100000, 999999)}"


class Order(TimestampMixin, db.Model):
    __tablename__ = "orders"

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    order_number = db.Column(db.String(20), unique=True, nullable=False, default=_order_number)
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status = db.Column(db.Enum(OrderStatus), nullable=False, default=OrderStatus.pending)
    subtotal_cents = db.Column(db.Integer, nullable=False, default=0)
    total_cents = db.Column(db.Integer, nullable=False, default=0)
    currency = db.Column(db.String(10), nullable=False, default="USD")
    stripe_session_id = db.Column(db.String(255), unique=True)
    stripe_payment_intent_id = db.Column(db.String(255))
    shipping_address = db.Column(db.JSON)
    customer_email = db.Column(db.String(255))
    customer_name = db.Column(db.String(255))
    notes = db.Column(db.Text)

    user = db.relationship("User", back_populates="orders")
    order_items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self, with_items: bool = True):
        d = {
            "id": self.id,
            "order_number": self.order_number,
            "user_id": self.user_id,
            "status": self.status.value,
            "subtotal_cents": self.subtotal_cents,
            "total_cents": self.total_cents,
            "currency": self.currency,
            "shipping_address": self.shipping_address,
            "customer_email": self.customer_email,
            "customer_name": self.customer_name,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
        if with_items:
            d["order_items"] = [i.to_dict() for i in self.order_items]
        return d


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    order_id = db.Column(
        db.String(36), db.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id = db.Column(db.String(36), db.ForeignKey("products.id", ondelete="SET NULL"))
    name = db.Column(db.String(255), nullable=False)
    unit_price_cents = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    customization = db.Column(db.JSON, nullable=False, default=dict)

    order = db.relationship("Order", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "name": self.name,
            "unit_price_cents": self.unit_price_cents,
            "quantity": self.quantity,
            "customization": self.customization or {},
        }


# --------------------------------------------------------- appointments ----
class Appointment(TimestampMixin, db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    service = db.Column(db.String(255), nullable=False)
    scheduled_date = db.Column(db.Date, nullable=False)
    scheduled_time = db.Column(db.String(20), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(50))
    status = db.Column(
        db.Enum(AppointmentStatus), nullable=False, default=AppointmentStatus.confirmed
    )
    notes = db.Column(db.Text)

    user = db.relationship("User", back_populates="appointments")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "service": self.service,
            "scheduled_date": self.scheduled_date.isoformat(),
            "scheduled_time": self.scheduled_time,
            "full_name": self.full_name,
            "email": self.email,
            "address": self.address,
            "phone": self.phone,
            "status": self.status.value,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
        }


# ---------------------------------------------------------- measurements ----
class Measurement(TimestampMixin, db.Model):
    __tablename__ = "measurements"
    __table_args__ = (db.UniqueConstraint("user_id", "label", name="uq_measurement_user_label"),)

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    label = db.Column(db.String(120), nullable=False, default="Primary")
    chest_cm = db.Column(db.Numeric(6, 2))
    waist_cm = db.Column(db.Numeric(6, 2))
    hips_cm = db.Column(db.Numeric(6, 2))
    sleeve_cm = db.Column(db.Numeric(6, 2))
    inseam_cm = db.Column(db.Numeric(6, 2))
    shoulder_cm = db.Column(db.Numeric(6, 2))
    neck_cm = db.Column(db.Numeric(6, 2))
    notes = db.Column(db.Text)

    user = db.relationship("User", back_populates="measurements")

    NUMERIC_FIELDS = (
        "chest_cm",
        "waist_cm",
        "hips_cm",
        "sleeve_cm",
        "inseam_cm",
        "shoulder_cm",
        "neck_cm",
    )

    def to_dict(self):
        d = {
            "id": self.id,
            "user_id": self.user_id,
            "label": self.label,
            "notes": self.notes,
            "updated_at": self.updated_at.isoformat(),
        }
        for f in self.NUMERIC_FIELDS:
            v = getattr(self, f)
            d[f] = float(v) if v is not None else None
        return d


# ---------------------------------------------------------- notifications ----
class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.String(36), primary_key=True, default=new_uuid)
    user_id = db.Column(
        db.String(36), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title = db.Column(db.String(255), nullable=False)
    body = db.Column(db.Text)
    kind = db.Column(db.String(50), nullable=False, default="info")
    link = db.Column(db.String(255))
    read_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)

    user = db.relationship("User", back_populates="notifications")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "body": self.body,
            "kind": self.kind,
            "link": self.link,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "created_at": self.created_at.isoformat(),
        }

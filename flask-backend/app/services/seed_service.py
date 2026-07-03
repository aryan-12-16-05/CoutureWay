"""Seed data — identical to the old Supabase migration's seed products."""
from ..extensions import db
from ..models import Product

SEED_PRODUCTS = [
    dict(slug="onyx-tuxedo", name="Onyx Tuxedo",
         description="Hand-finished black tie tuxedo in Italian super 150s wool.",
         category="Tuxedo", price_cents=420000,
         image_url="/src/assets/collection-overcoat.jpg", is_custom=True),
    dict(slug="camel-overcoat", name="Camel Overcoat",
         description="Floor-grazing camel hair overcoat, fully canvassed.",
         category="Outerwear", price_cents=285000,
         image_url="/src/assets/collection-overcoat.jpg", is_custom=True),
    dict(slug="atelier-trouser", name="Atelier Trouser",
         description="High-rise pleated trouser in cool wool flannel.",
         category="Trouser", price_cents=78000,
         image_url="/src/assets/collection-trouser.jpg", is_custom=False),
    dict(slug="cashmere-knit", name="Cashmere Knit",
         description="Mongolian cashmere crewneck, fully fashioned.",
         category="Knitwear", price_cents=92000,
         image_url="/src/assets/collection-knit.jpg", is_custom=False),
    dict(slug="bridal-couture", name="Bridal Couture",
         description="Made-to-measure bridal gown — hand-embroidered.",
         category="Bridal", price_cents=820000,
         image_url="/src/assets/wedding-couple.jpg", is_custom=True),
]


def seed_products() -> int:
    created = 0
    for row in SEED_PRODUCTS:
        if not Product.query.filter_by(slug=row["slug"]).first():
            db.session.add(Product(**row))
            created += 1
    db.session.commit()
    return created

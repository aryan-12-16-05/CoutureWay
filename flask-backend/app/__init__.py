"""Application factory for the CoutureWay Flask REST backend."""
from flask import Flask
from flask_cors import CORS

from .config import get_config
from .extensions import db, migrate
from .middleware.error_handlers import register_error_handlers


def create_app(config_object=None):
    app = Flask(__name__)
    app.config.from_object(config_object or get_config())

    # --- Extensions -------------------------------------------------------
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=False,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        max_age=86400,
    )

    # --- Blueprints -------------------------------------------------------
    from .routes.auth import auth_bp
    from .routes.profile import profile_bp
    from .routes.products import products_bp
    from .routes.orders import orders_bp
    from .routes.appointments import appointments_bp
    from .routes.measurements import measurements_bp
    from .routes.notifications import notifications_bp
    from .routes.carts import carts_bp

    for bp in (
        auth_bp,
        profile_bp,
        products_bp,
        orders_bp,
        appointments_bp,
        measurements_bp,
        notifications_bp,
        carts_bp,
    ):
        app.register_blueprint(bp, url_prefix="/api")

    # --- Errors -----------------------------------------------------------
    register_error_handlers(app)

    # --- Health -----------------------------------------------------------
    @app.get("/api/health")
    def health():
        return {"data": {"status": "ok"}}

    # --- CLI --------------------------------------------------------------
    @app.cli.command("init-db")
    def init_db():
        """Create all tables and seed initial product data."""
        from .services.seed_service import seed_products

        db.create_all()
        created = seed_products()
        print(f"Database initialised. Seeded {created} products.")

    return app

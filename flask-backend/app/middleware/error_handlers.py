"""Global JSON error handlers. Internal details are never leaked to clients."""
from werkzeug.exceptions import HTTPException

from ..extensions import db
from ..utils.responses import error


def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return error(getattr(e, "description", None) or "Bad request", 400)

    @app.errorhandler(401)
    def unauthorized(e):
        return error("Unauthorized", 401)

    @app.errorhandler(403)
    def forbidden(e):
        return error("Forbidden", 403)

    @app.errorhandler(404)
    def not_found(e):
        return error("Resource not found", 404)

    @app.errorhandler(405)
    def method_not_allowed(e):
        return error("Method not allowed", 405)

    @app.errorhandler(409)
    def conflict(e):
        return error(getattr(e, "description", None) or "Conflict", 409)

    @app.errorhandler(422)
    def unprocessable(e):
        return error(getattr(e, "description", None) or "Validation failed", 422)

    @app.errorhandler(HTTPException)
    def http_exception(e):
        return error(e.description or e.name, e.code or 500)

    @app.errorhandler(Exception)
    def internal_error(e):
        db.session.rollback()
        app.logger.exception(e)
        return error("Internal server error", 500)

"""Auth endpoints: signup, signin, me, signout."""
from flask import Blueprint, g, request

from ..middleware.auth import auth_required
from ..schemas.validators import ValidationError, validate_signin, validate_signup
from ..services import auth_service
from ..utils.responses import created, error, ok
from ..utils.tokens import create_access_token

auth_bp = Blueprint("auth", __name__)


def _json_body():
    body = request.get_json(silent=True)
    if body is None:
        return None
    return body


@auth_bp.post("/auth/signup")
def signup():
    body = _json_body()
    if body is None:
        return error("Invalid JSON body", 400)
    try:
        data = validate_signup(body)
    except ValidationError as e:
        return error("Validation failed", 422, e.details)
    try:
        user = auth_service.sign_up(data["email"], data["password"], data["full_name"])
    except auth_service.EmailTakenError:
        return error("An account with this email already exists", 409)
    token = create_access_token(user.id)
    return created({"user": user.to_dict(), "access_token": token})


@auth_bp.post("/auth/signin")
def signin():
    body = _json_body()
    if body is None:
        return error("Invalid JSON body", 400)
    try:
        data = validate_signin(body)
    except ValidationError as e:
        return error("Validation failed", 422, e.details)
    try:
        user = auth_service.sign_in(data["email"], data["password"])
    except auth_service.InvalidCredentialsError:
        return error("Invalid email or password", 401)
    token = create_access_token(user.id)
    return ok({"user": user.to_dict(), "access_token": token})


@auth_bp.get("/auth/me")
@auth_required
def me():
    return ok(auth_service.me_payload(g.current_user))


@auth_bp.post("/auth/signout")
@auth_required
def signout():
    # Stateless JWT: the client discards the token. Endpoint exists for symmetry/audit.
    return ok({"signed_out": True})

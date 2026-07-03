"""Signup/signin logic — mirrors the old Supabase handle_new_user trigger."""
from flask import current_app

from ..extensions import db
from ..models import AppRole, Profile, User, UserRole
from ..utils.security import hash_password, verify_password


class EmailTakenError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


def sign_up(email: str, password: str, full_name: str | None) -> User:
    if User.query.filter(db.func.lower(User.email) == email.lower()).first():
        raise EmailTakenError()

    user = User(email=email, password_hash=hash_password(password))
    db.session.add(user)
    db.session.flush()  # user.id available

    db.session.add(Profile(id=user.id, email=user.email, full_name=full_name))
    db.session.add(UserRole(user_id=user.id, role=AppRole.user))

    admin_email = current_app.config.get("ADMIN_EMAIL", "")
    if admin_email and email.lower() == admin_email:
        db.session.add(UserRole(user_id=user.id, role=AppRole.admin))

    db.session.commit()
    return user


def sign_in(email: str, password: str) -> User:
    user = User.query.filter(db.func.lower(User.email) == email.lower()).first()
    if user is None or not verify_password(user.password_hash, password):
        raise InvalidCredentialsError()
    return user


def me_payload(user: User) -> dict:
    return {
        "user": user.to_dict(),
        "profile": user.profile.to_dict() if user.profile else None,
        "roles": [r.role.value for r in user.roles],
    }

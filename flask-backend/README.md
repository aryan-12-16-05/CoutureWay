# CoutureWay Flask REST Backend

Production-structured Flask API replacing the previous Supabase backend.

## Stack
Flask · Flask-SQLAlchemy · Flask-Migrate · Flask-CORS · PyJWT · python-dotenv · Werkzeug password hashing.

## Quick start

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # set SECRET_KEY / JWT_SECRET_KEY / ADMIN_EMAIL
flask --app run.py init-db  # create_all + seed the 5 catalogue products
flask --app run.py run
```

## Architecture

- `app/__init__.py` — application factory: extensions, CORS, blueprints, error handlers, `init-db` CLI.
- `app/config.py` — env-driven config; `DATABASE_URL` swaps SQLite → Postgres/MySQL with no code changes.
- `app/models/` — SQLAlchemy models with relationships, FKs, unique/check constraints, and enum parity with the old Postgres schema (users, profiles, user_roles, products, carts, cart_items, orders, order_items, appointments, measurements, notifications).
- `app/routes/` — one blueprint per resource; thin controllers.
- `app/services/` — business logic. `notification_service` reproduces the old DB triggers (appointment-created and order-status notifications). `auth_service` reproduces the `handle_new_user` trigger (profile + default role + admin grant for `ADMIN_EMAIL`).
- `app/schemas/validators.py` — explicit request validation (mirrors the old zod schemas); raises structured `details` on 422.
- `app/middleware/` — `auth_required` / `admin_required` JWT guards and global JSON error handlers (400/401/403/404/405/409/422/500) with session rollback on 500.
- `app/utils/` — JWT encode/decode, pbkdf2 password hashing, uniform `{"data"} / {"error"}` responses.

## Security

- Secrets only via `.env` (never committed).
- Passwords hashed with PBKDF2-SHA256; plaintext never stored.
- All queries go through the ORM (parameterised — no SQL injection surface).
- Input validated and length-capped before touching the DB.
- Admin-only routes enforce role checks server-side.
- Internal exceptions are logged, rolled back, and returned as a generic 500 body.

## Migrations

`Flask-Migrate` is wired. Generate the initial revision on your machine:

```bash
flask --app run.py db init
flask --app run.py db migrate -m "initial schema"
flask --app run.py db upgrade
```

or skip migrations entirely in dev with `flask --app run.py init-db`.

# CoutureWay — Luxury Tailoring Platform

Full-stack luxury fashion e-commerce and custom tailoring platform.

- **Frontend:** TanStack Start (React 19, Vite 7, Tailwind v4, framer-motion) — visually unchanged from the original.
- **Backend:** Python **Flask REST API** + **SQLAlchemy** (migrated from Supabase). SQLite in dev; PostgreSQL/MySQL via a single `DATABASE_URL` change.
- **Auth:** JWT (email + password). Signup/signin issue a bearer token consumed by the frontend data layer.

## Repository layout

```
├── src/                    # TanStack Start frontend (UI untouched by the migration)
│   ├── lib/api-client.ts   # single data-layer entry point → Flask REST API
│   └── routes/             # pages (file-based routing)
├── flask-backend/          # Python Flask REST backend (clean architecture)
│   ├── app/
│   │   ├── routes/         # blueprints: auth, profile, products, orders,
│   │   │                   # appointments, measurements, notifications, cart
│   │   ├── models/         # SQLAlchemy models (schema parity with old Supabase DB)
│   │   ├── services/       # business logic (incl. notification "triggers")
│   │   ├── schemas/        # request validation
│   │   ├── middleware/     # JWT guards + global JSON error handlers
│   │   └── utils/          # tokens, hashing, responses, uuid
│   ├── migrations/         # Flask-Migrate (see its README)
│   ├── requirements.txt
│   └── run.py
└── package.json
```

## Running the app

### 1. Backend (Flask)

```bash
cd flask-backend
python -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                # then edit secrets
flask --app run.py init-db          # create tables + seed products
flask --app run.py run              # http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`.

### 2. Frontend (TanStack Start)

```bash
cp .env.example .env                # sets VITE_API_BASE_URL=http://localhost:5000/api
bun install                         # or: npm install
bun run dev                         # or: npm run dev
```

The dev server prints its URL (typically http://localhost:8080 in the Lovable config). Make sure that origin is present in `CORS_ORIGINS` in `flask-backend/.env`.

## API surface

All endpoints are prefixed with `/api`. Success responses are `{"data": ...}`, errors are `{"error": "...", "details"?: {...}}`.

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/signup`, `POST /auth/signin`, `GET /auth/me`, `POST /auth/signout` |
| Profile | `GET /profile`, `PUT /profile` |
| Products | `GET /products?category=&limit=`, `GET /products/:id`, admin: `POST /products`, `PUT/PATCH /products/:id`, `DELETE /products/:id` |
| Orders | `GET /orders`, `GET /orders/:id`, `POST /orders`, admin: `PATCH /orders/:id` (status → notification) |
| Appointments | `GET /appointments?order=asc|desc`, `POST /appointments` (→ notification), `PATCH /appointments/:id`, `DELETE /appointments/:id` |
| Measurements | `GET /measurements`, `PUT /measurements` (upsert) |
| Notifications | `GET /notifications?limit=`, `GET /notifications/unread-count`, `PATCH /notifications/:id/read`, `POST /notifications/read-all` |
| Cart | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id` |

Protected routes require `Authorization: Bearer <token>`.

## Behaviour parity notes

- The email in `ADMIN_EMAIL` receives the admin role on signup (mirrors the old Postgres trigger).
- Appointment creation and order status changes create in-app notifications (mirrors the old DB triggers).
- Supabase realtime subscriptions were replaced with 30-second polling in the notifications bell and dashboard.
- Google OAuth (previously Lovable Cloud) is not wired to the Flask backend; the button remains and explains this. Email auth is fully functional.

## Migration caveats

See `MIGRATION_NOTES.md` for the list of binary assets and generated files you must copy from the original Lovable repo before first run.

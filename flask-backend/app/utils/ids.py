"""UUID helpers — string UUIDs keep parity with the previous Postgres schema."""
import uuid


def new_uuid() -> str:
    return str(uuid.uuid4())

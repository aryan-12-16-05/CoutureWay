# Migrations

Flask-Migrate (Alembic) is wired up. To create the initial migration on your machine:

    flask --app run.py db init      # only once, creates alembic scaffolding here
    flask --app run.py db migrate -m "initial schema"
    flask --app run.py db upgrade

For a zero-friction start (no migrations), use the built-in CLI instead:

    flask --app run.py init-db      # create_all + seed products

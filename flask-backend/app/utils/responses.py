"""Uniform JSON response helpers: {"data": ...} on success, {"error": ...} on failure."""
from flask import jsonify


def ok(data, status: int = 200):
    return jsonify({"data": data}), status


def created(data):
    return ok(data, 201)


def error(message: str, status: int, details=None):
    body = {"error": message}
    if details is not None:
        body["details"] = details
    return jsonify(body), status

"""Tests for the health endpoint."""

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health_check() -> None:
    """GET /api/health returns the expected healthy payload."""
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_health_response_content_type() -> None:
    """The health endpoint is a JSON API response."""
    response = client.get("/api/health")

    assert response.headers["content-type"].startswith("application/json")

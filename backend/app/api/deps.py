"""Shared FastAPI dependencies.

Dependencies here are reusable across routers and keep route handlers free of
infrastructure concerns (config access, DB sessions, auth in later sprints).
"""

from collections.abc import Generator

from app.core.config import Settings, get_settings


def get_settings_dependency() -> Generator[Settings, None, None]:
    """FastAPI dependency exposing the cached application settings."""
    yield get_settings()

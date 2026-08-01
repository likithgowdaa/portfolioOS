"""Health check response schemas."""

from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Contract for ``GET /api/health``."""

    status: Literal["healthy"] = "healthy"

"""Health / liveness endpoints."""

from fastapi import APIRouter, status

from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check",
)
def health_check() -> HealthResponse:
    """Liveness probe for load balancers and orchestrators."""
    return HealthResponse()

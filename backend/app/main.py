"""FastAPI application entrypoint.

The application is assembled by ``create_app`` so that tests and tooling can
build an isolated instance when needed. The module-level ``app`` object is what
ASGI servers (uvicorn) import and serve.
"""

from fastapi import FastAPI

from app.api.routers import health
from app.core.config import settings
from app.core.logging import configure_logging
from app.middleware.cors import configure_cors


def create_app() -> FastAPI:
    """Build and configure the application instance."""
    configure_logging(settings.LOG_LEVEL)

    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Production-grade engineering portfolio and CMS API.",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )

    configure_cors(app)
    app.include_router(health.router, prefix="/api")

    return app


app = create_app()

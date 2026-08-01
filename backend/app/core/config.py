"""Application settings, loaded from environment variables and ``.env``.

Never hard-code secrets here. All values come from the environment via
pydantic-settings, so the same code path works locally, in Docker, and on
Railway in production.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed access to the application configuration."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # -- Application -----------------------------------------------------------
    PROJECT_NAME: str = "PortfolioOS"
    VERSION: str = "0.0.1"
    ENVIRONMENT: str = "development"  # development | production | test
    LOG_LEVEL: str = "INFO"

    # -- CORS ------------------------------------------------------------------
    # Comma-separated list of allowed browser origins (no trailing slash).
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # -- Database (Supabase / Postgres) ---------------------------------------
    # Wired up in Sprint 02. Kept here now so the contract is defined once.
    SUPABASE_URL: str | None = None
    SUPABASE_ANON_KEY: str | None = None
    # Direct Postgres connection string (supabase pooler). Optional.
    DATABASE_URL: str | None = None

    @property
    def cors_origins(self) -> list[str]:
        """Parse ``CORS_ORIGINS`` into a clean list of origins."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


@lru_cache
def get_settings() -> Settings:
    """Return a cached ``Settings`` instance (env is read once per process)."""
    return Settings()


settings = get_settings()

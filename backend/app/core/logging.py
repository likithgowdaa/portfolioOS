"""Centralized logging configuration."""

import logging
import sys


def configure_logging(level: str = "INFO") -> None:
    """Configure root logging to stdout with a consistent format.

    Requests are served via uvicorn which configures its own loggers; this
    keeps application loggers aligned so no message is lost or duplicated.
    """
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        stream=sys.stdout,
    )

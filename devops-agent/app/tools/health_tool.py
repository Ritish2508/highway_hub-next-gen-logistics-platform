from langchain.tools import tool
from app.config import settings
import httpx

@tool
def check_backend_health() -> str:
    """Check if the HighwayHub backend API is healthy."""
    try:
        r = httpx.get(f"{settings.backend_url}/health", timeout=5)
        return f"Backend: {r.status_code} — {r.text[:200]}"
    except Exception as e:
        return f"Backend unreachable: {e}"

@tool
def check_frontend_health() -> str:
    """Check if the HighwayHub frontend is reachable."""
    try:
        r = httpx.get(settings.frontend_url, timeout=5)
        return f"Frontend: {r.status_code}"
    except Exception as e:
        return f"Frontend unreachable: {e}"
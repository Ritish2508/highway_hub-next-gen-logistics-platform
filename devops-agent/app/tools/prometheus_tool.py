from langchain.tools import tool
from app.config import settings
import requests

def _prom_query(query: str) -> str:
    try:
        resp = requests.get(
            f"{settings.prometheus_url}/api/v1/query",
            params={"query": query},
            timeout=10
        )
        data = resp.json()
        results = data.get("data", {}).get("result", [])
        if not results:
            return f"No data for query: {query}"
        lines = []
        for r in results[:10]:
            metric = r.get("metric", {})
            value = r.get("value", [None, "?"])[1]
            lines.append(f"{metric} = {value}")
        return "\n".join(lines)
    except Exception as e:
        return f"Prometheus error: {e}"

@tool
def get_active_alerts() -> str:
    """Get all currently firing Prometheus alerts."""
    try:
        resp = requests.get(
            f"{settings.prometheus_url}/api/v1/alerts", timeout=10
        )
        alerts = resp.json().get("data", {}).get("alerts", [])
        if not alerts:
            return "No active alerts."
        lines = []
        for a in alerts:
            name = a.get("labels", {}).get("alertname", "unknown")
            severity = a.get("labels", {}).get("severity", "?")
            state = a.get("state", "?")
            lines.append(f"- [{severity.upper()}] {name}: {state}")
        return "\n".join(lines)
    except Exception as e:
        return f"Could not reach Prometheus: {e}"

@tool
def get_cpu_usage(namespace: str = "default") -> str:
    """Get CPU usage for pods in a namespace."""
    return _prom_query(
        f'sum(rate(container_cpu_usage_seconds_total{{namespace="{namespace}"}}[5m])) by (pod)'
    )

@tool
def get_memory_usage(namespace: str = "default") -> str:
    """Get memory usage for pods in a namespace."""
    return _prom_query(
        f'sum(container_memory_usage_bytes{{namespace="{namespace}"}}) by (pod)'
    )

@tool
def get_error_rate(namespace: str = "default") -> str:
    """Get HTTP error rate for services in a namespace."""
    return _prom_query(
        f'sum(rate(http_requests_total{{namespace="{namespace}",status=~"5.."}}[5m])) by (service)'
    )
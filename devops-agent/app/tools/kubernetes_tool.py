from langchain.tools import tool
from app.config import settings
import subprocess
import json

def _kubectl(cmd: list[str]) -> str:
    """Run kubectl and return stdout as string."""
    try:
        result = subprocess.run(
            ["kubectl"] + cmd,
            capture_output=True, text=True, timeout=15
        )
        return result.stdout or result.stderr
    except Exception as e:
        return f"kubectl error: {e}"

@tool
def get_pod_status(namespace: str = "default") -> str:
    """Get status of all pods in a Kubernetes namespace."""
    return _kubectl(["get", "pods", "-n", namespace, "-o", "wide"])

@tool
def get_deployment_status(namespace: str = "default") -> str:
    """Get all deployments and their replica status in a namespace."""
    return _kubectl(["get", "deployments", "-n", namespace, "-o", "wide"])

@tool
def get_pod_logs(pod_name: str, namespace: str = "default", tail: int = 50) -> str:
    """Get recent logs from a specific pod. Use this to diagnose failures."""
    return _kubectl(["logs", pod_name, "-n", namespace, f"--tail={tail}"])

@tool
def describe_pod(pod_name: str, namespace: str = "default") -> str:
    """Describe a pod to see events, resource limits, and failure reasons."""
    return _kubectl(["describe", "pod", pod_name, "-n", namespace])

@tool
def get_services(namespace: str = "default") -> str:
    """List all services and their exposed ports in a namespace."""
    return _kubectl(["get", "services", "-n", namespace])

@tool
def get_all_namespaces() -> str:
    """List all Kubernetes namespaces."""
    return _kubectl(["get", "namespaces"])

@tool
def get_events(namespace: str = "default") -> str:
    """Get recent Kubernetes events — useful for spotting OOMKills, scheduling failures."""
    return _kubectl(["get", "events", "-n", namespace, "--sort-by=.lastTimestamp"])
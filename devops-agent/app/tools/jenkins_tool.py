from langchain.tools import tool
from app.config import settings
import requests

def _jenkins_get(path: str) -> dict:
    try:
        resp = requests.get(
            f"{settings.jenkins_url}{path}",
            auth=(settings.jenkins_user, settings.jenkins_token),
            timeout=10
        )
        return resp.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def get_jenkins_jobs() -> str:
    """List all Jenkins jobs and their last build status."""
    data = _jenkins_get(
        "/api/json?tree=jobs[name,color,lastBuild[number,result,timestamp,duration]]"
    )
    if "error" in data:
        return f"Jenkins unreachable: {data['error']}"
    jobs = data.get("jobs", [])
    lines = []
    for job in jobs:
        lb = job.get("lastBuild") or {}
        result = lb.get("result", "UNKNOWN")
        num = lb.get("number", "?")
        lines.append(f"- {job['name']}: #{num} → {result}")
    return "\n".join(lines) if lines else "No jobs found."

@tool
def get_build_log(job_name: str, build_number: int = -1) -> str:
    """Get the console log for a Jenkins build."""
    path = f"/job/{job_name}/lastBuild/consoleText" if build_number == -1 \
           else f"/job/{job_name}/{build_number}/consoleText"
    try:
        resp = requests.get(
            f"{settings.jenkins_url}{path}",
            auth=(settings.jenkins_user, settings.jenkins_token),
            timeout=10
        )
        return resp.text[-3000:]
    except Exception as e:
        return f"Error fetching build log: {e}"

@tool
def get_jenkins_queue() -> str:
    """Get currently queued Jenkins builds."""
    data = _jenkins_get("/queue/api/json?tree=items[task[name],why,blocked]")
    if "error" in data:
        return f"Jenkins unreachable: {data['error']}"
    items = data.get("items", [])
    if not items:
        return "Build queue is empty."
    lines = [f"- {i['task']['name']}: {i.get('why', 'queued')}" for i in items]
    return "\n".join(lines)
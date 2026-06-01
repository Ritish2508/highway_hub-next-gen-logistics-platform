from langchain.tools import tool
from app.config import settings
import requests

def _sonar_get(path: str) -> dict:
    try:
        resp = requests.get(
            f"{settings.sonar_url}{path}",
            headers={"Authorization": f"Bearer {settings.sonar_token}"},
            timeout=10
        )
        return resp.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def get_sonar_quality_gate() -> str:
    """Get the SonarQube quality gate status for the HighwayHub project."""
    data = _sonar_get(
        f"/api/qualitygates/project_status?projectKey={settings.sonar_project_key}"
    )
    if "error" in data:
        return f"SonarQube unreachable: {data['error']}"
    status = data.get("projectStatus", {})
    gate = status.get("status", "UNKNOWN")
    conditions = status.get("conditions", [])
    lines = [f"Quality gate: {gate}"]
    for c in conditions:
        if c.get("status") != "OK":
            lines.append(f"  ✗ {c['metricKey']}: {c.get('actualValue')} (threshold: {c.get('errorThreshold')})")
    return "\n".join(lines)

@tool
def get_sonar_issues() -> str:
    """Get open SonarQube issues (bugs, vulnerabilities, code smells)."""
    data = _sonar_get(
        f"/api/issues/search?projectKeys={settings.sonar_project_key}&resolved=false&ps=10"
    )
    if "error" in data:
        return f"SonarQube error: {data['error']}"
    issues = data.get("issues", [])
    if not issues:
        return "No open issues."
    lines = []
    for i in issues[:10]:
        lines.append(f"- [{i['severity']}] {i['type']}: {i['message'][:80]}")
    return "\n".join(lines)
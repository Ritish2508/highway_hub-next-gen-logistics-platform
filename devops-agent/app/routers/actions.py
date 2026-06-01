from fastapi import APIRouter, HTTPException
from app.models import ActionRequest
from app.config import settings
from app.audit.logger import log_interaction
import subprocess

router = APIRouter()

SAFE_ACTIONS = {
    "rollout_restart": lambda r: [
        "kubectl", "rollout", "restart",
        f"deployment/{r.deployment}", "-n", r.namespace
    ],
    "scale": lambda r: [
        "kubectl", "scale",
        f"deployment/{r.deployment}",
        f"--replicas={r.replicas}", "-n", r.namespace
    ],
    "check_rollout": lambda r: [
        "kubectl", "rollout", "status",
        f"deployment/{r.deployment}", "-n", r.namespace
    ],
}

@router.post("/action")
async def execute_action(req: ActionRequest):
    if settings.agent_mode != "approval":
        raise HTTPException(403, "Agent is in read-only mode.")
    if not req.approved:
        raise HTTPException(400, "Set approved=true to confirm this action.")
    if req.action not in SAFE_ACTIONS:
        raise HTTPException(400, f"Unknown action: {req.action}")

    cmd = SAFE_ACTIONS[req.action](req)
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    output = result.stdout or result.stderr

    await log_interaction(
        session_id="action",
        query=str(req.dict()),
        tools_used=["kubectl"],
        answer=output,
        action_taken=req.action,
        action_approved=True,
    )

    return {"action": req.action, "output": output}
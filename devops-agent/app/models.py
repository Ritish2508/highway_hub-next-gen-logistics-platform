from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    answer: str
    session_id: str
    sources: list[str] = []

class ActionRequest(BaseModel):
    action: Literal["rollout_restart", "scale", "trigger_build", "check_rollout"]
    namespace: Optional[str] = "default"
    deployment: Optional[str] = None
    replicas: Optional[int] = None
    job_name: Optional[str] = None
    approved: bool = False

class AuditEntry(BaseModel):
    timestamp: datetime
    session_id: str
    query: str
    tools_used: list[str]
    answer_summary: str
    action_taken: Optional[str] = None
    action_approved: bool = False
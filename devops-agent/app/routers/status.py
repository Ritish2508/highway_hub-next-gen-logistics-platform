from fastapi import APIRouter
from app.audit.logger import get_audit_log
from app.config import settings

router = APIRouter()

@router.get("/status")
async def status():
    return {
        "service": "HighwayHub DevOps Agent",
        "mode": settings.agent_mode,
        "version": "1.0.0",
    }

@router.get("/audit")
async def audit(limit: int = 50):
    return await get_audit_log(limit=limit)
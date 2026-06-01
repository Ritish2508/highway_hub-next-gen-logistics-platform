from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.models import AuditEntry
from datetime import datetime, timezone

_client = None
_db = None

def get_db():
    global _client, _db
    if _db is None:
        _client = AsyncIOMotorClient(settings.mongodb_uri)
        _db = _client.highwayhub_agent
    return _db

async def log_interaction(
    session_id: str,
    query: str,
    tools_used: list[str],
    answer: str,
    action_taken: str = None,
    action_approved: bool = False,
):
    db = get_db()
    entry = {
        "timestamp": datetime.now(timezone.utc),
        "session_id": session_id,
        "query": query,
        "tools_used": tools_used,
        "answer_summary": answer[:500],
        "action_taken": action_taken,
        "action_approved": action_approved,
    }
    await db.audit_log.insert_one(entry)

async def get_audit_log(limit: int = 50) -> list:
    db = get_db()
    cursor = db.audit_log.find({}).sort("timestamp", -1).limit(limit)
    entries = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        entries.append(doc)
    return entries
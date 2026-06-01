from fastapi import APIRouter
from app.models import ChatRequest, ChatResponse
from app.agent.core import build_agent, get_history, append_history
from app.audit.logger import log_interaction
import re

router = APIRouter()
_agent = None

def get_agent():
    global _agent
    if _agent is None:
        _agent = build_agent()
    return _agent

def extract_tools(text: str) -> list[str]:
    """Extract tools used from agent response. Returns [] if none used."""
    match = re.search(r'\[Tools used:\s*([^\]]+)\]', text, re.IGNORECASE)
    if not match:
        return []
    raw = match.group(1).strip()
    # Handle 'none', 'None', empty string
    if raw.lower() == "none" or not raw:
        return []
    return [t.strip() for t in raw.split(",") if t.strip()]

def clean_answer(text: str) -> str:
    """Remove [Tools used: ...] line from final answer shown to user."""
    cleaned = re.sub(r'\[Tools used:[^\]]*\]', '', text, flags=re.IGNORECASE)
    return cleaned.strip()

def safe_get_output(result) -> str:
    """Safely extract output string from agent result."""
    if isinstance(result, dict):
        return result.get("output", "I could not generate a response.")
    if isinstance(result, str):
        return result
    if hasattr(result, "content"):
        return result.content
    return "I could not generate a response."

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    agent = get_agent()
    history = get_history(req.session_id or "default")

    try:
        result = agent.invoke({
            "input": req.message,
            "chat_history": history if history else [],
        })
        raw_answer = safe_get_output(result)
    except Exception as e:
        raw_answer = f"Agent error: {str(e)}"

    tools_used = extract_tools(raw_answer)
    answer = clean_answer(raw_answer)

    append_history(req.session_id or "default", req.message, answer)

    await log_interaction(
        session_id=req.session_id or "default",
        query=req.message,
        tools_used=tools_used,
        answer=answer,
    )

    return ChatResponse(
        answer=answer,
        session_id=req.session_id or "default",
        sources=tools_used,
    )
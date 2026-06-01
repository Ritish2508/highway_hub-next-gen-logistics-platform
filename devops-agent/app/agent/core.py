from langchain_groq import ChatGroq
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

from app.config import settings
from app.agent.prompts import SYSTEM_PROMPT
from app.tools.kubernetes_tool import (
    get_pod_status, get_deployment_status, get_pod_logs,
    describe_pod, get_services, get_all_namespaces, get_events
)
from app.tools.jenkins_tool import (
    get_jenkins_jobs, get_build_log, get_jenkins_queue
)
from app.tools.prometheus_tool import (
    get_active_alerts, get_cpu_usage, get_memory_usage, get_error_rate
)
from app.tools.health_tool import check_backend_health, check_frontend_health
from app.tools.sonarqube_tool import get_sonar_quality_gate, get_sonar_issues

ALL_TOOLS = [
    get_pod_status, get_deployment_status, get_pod_logs,
    describe_pod, get_services, get_all_namespaces, get_events,
    get_jenkins_jobs, get_build_log, get_jenkins_queue,
    get_active_alerts, get_cpu_usage, get_memory_usage, get_error_rate,
    check_backend_health, check_frontend_health,
    get_sonar_quality_gate, get_sonar_issues,
]

def build_agent() -> AgentExecutor:
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=settings.groq_api_key,
        temperature=0,
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT.format(mode=settings.agent_mode)),
        MessagesPlaceholder("chat_history", optional=True),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ])

    agent = create_tool_calling_agent(llm, ALL_TOOLS, prompt)
    return AgentExecutor(
        agent=agent,
        tools=ALL_TOOLS,
        verbose=True,
        max_iterations=8
    )

_sessions: dict[str, list] = {}

def get_history(session_id: str) -> list:
    return _sessions.get(session_id, [])

def append_history(session_id: str, human: str, ai: str):
    if session_id not in _sessions:
        _sessions[session_id] = []
    _sessions[session_id].append(HumanMessage(content=human))
    _sessions[session_id].append(AIMessage(content=ai))
    _sessions[session_id] = _sessions[session_id][-20:]
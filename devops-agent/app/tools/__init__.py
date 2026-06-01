from app.tools.kubernetes_tool import (
    get_pod_status,
    get_deployment_status,
    get_pod_logs,
    describe_pod,
    get_services,
    get_all_namespaces,
    get_events,
)
from app.tools.jenkins_tool import (
    get_jenkins_jobs,
    get_build_log,
)
from app.tools.prometheus_tool import (
    get_active_alerts,
    get_cpu_usage,
    get_memory_usage,
)
from app.tools.health_tool import (
    check_backend_health,
    check_frontend_health,
)
from app.tools.sonarqube_tool import (
    get_sonar_quality_gate,
    get_sonar_issues,
)

ALL_TOOLS = [
    get_pod_status,
    get_deployment_status,
    get_pod_logs,
    describe_pod,
    get_services,
    get_all_namespaces,
    get_events,
    get_jenkins_jobs,
    get_build_log,
    get_active_alerts,
    get_cpu_usage,
    get_memory_usage,
    check_backend_health,
    check_frontend_health,
    get_sonar_quality_gate,
    get_sonar_issues,
]

__all__ = ["ALL_TOOLS"]
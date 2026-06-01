from pydantic_settings import BaseSettings
from typing import Literal

class Settings(BaseSettings):
    groq_api_key: str
    k8s_in_cluster: bool = False
    kubeconfig_path: str = "/root/.kube/config"
    jenkins_url: str = "http://jenkins:8080"
    jenkins_user: str = "admin"
    jenkins_token: str = ""
    prometheus_url: str = "http://prometheus:9090"
    sonar_url: str = "http://sonarqube:9000"
    sonar_token: str = ""
    sonar_project_key: str = "highwayhub"
    backend_url: str = "http://backend:3000"
    frontend_url: str = "http://frontend:5173"
    mongodb_uri: str = "mongodb://localhost:27017/highwayhub_agent"
    agent_mode: Literal["readonly", "approval"] = "readonly"
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

settings = Settings()
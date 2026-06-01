from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import chat, status

app = FastAPI(
    title="HighwayHub DevOps Agent",
    description="AI-powered DevOps/SRE copilot for the HighwayHub platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/v1", tags=["agent"])
app.include_router(status.router, prefix="/api/v1", tags=["status"])

@app.get("/health")
def health():
    return {"status": "ok"}
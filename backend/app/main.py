from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from app.api import health, auth, incidents, dashboard
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# CORS middleware for communication with the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(incidents.router)
app.include_router(dashboard.router)

@app.get("/", include_in_schema=False)
def root_endpoint():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "healthy",
        "environment": "development",
        "documentation": "/docs",
        "openapi": "/openapi.json",
        "health": "/health",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.on_event("startup")
def startup_event():
    print("========================================")
    print("CyberFusion AI Backend Started")
    print(f"Version: {settings.VERSION}")
    print("Environment: Development")
    print("Swagger: http://localhost:8000/docs")
    print("Health: http://localhost:8000/health")
    print("========================================")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


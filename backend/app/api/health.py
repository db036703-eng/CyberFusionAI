from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "CyberFusion AI API",
        "version": "1.0.0"
    }

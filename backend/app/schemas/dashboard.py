from typing import List, Optional
from pydantic import BaseModel
from app.schemas.incident import IncidentResponse

class DashboardSummary(BaseModel):
    organization_risk: int
    critical_incidents: int
    open_incidents: int
    ioc_matches: int
    threat_feed_health: str
    ai_confidence: str

class SystemHealth(BaseModel):
    status: str
    db_connected: bool
    uptime_seconds: int

class ThreatFeedItem(BaseModel):
    id: str
    source: str
    indicator: str
    severity: str
    timestamp: str
    status: str

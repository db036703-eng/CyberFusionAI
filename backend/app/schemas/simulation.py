import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List
from app.db.models import SimulationStatus, IncidentSeverity
from app.schemas.auth import UserResponse

class SimulationRunRequest(BaseModel):
    scenario_name: str = Field(..., description="Name of the scenario to launch")

class SimulationEventResponse(BaseModel):
    id: uuid.UUID
    simulation_id: uuid.UUID
    stage: int
    title: str
    description: str
    severity: IncidentSeverity
    mitre_technique: Optional[str] = None
    timestamp: datetime
    incident_id: Optional[uuid.UUID] = None

    class Config:
        from_attributes = True

class SimulationResponse(BaseModel):
    id: uuid.UUID
    name: str
    status: SimulationStatus
    initiated_by: int
    initiated_by_user: Optional[UserResponse] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: int
    overall_risk: int
    incident_count: int
    risk_score_change: int
    result: Optional[str] = None

    class Config:
        from_attributes = True

import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class IncidentBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: Optional[str] = None
    severity: str = Field("info", description="Severity level: critical, warning, info, success")
    status: str = Field("active", description="Status level: active, investigating, mitigated, resolved")
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    mitre_technique: Optional[str] = None
    assigned_user_id: Optional[int] = None
    category: Optional[str] = None
    remediation: Optional[str] = None

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    mitre_technique: Optional[str] = None
    assigned_user_id: Optional[int] = None
    category: Optional[str] = None
    remediation: Optional[str] = None

class IncidentResponse(IncidentBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

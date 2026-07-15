import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.db.models import IncidentSeverity, IncidentStatus, IncidentCategory
from app.schemas.auth import UserResponse

class IncidentBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: Optional[str] = None
    severity: IncidentSeverity = Field(default=IncidentSeverity.Low)
    status: IncidentStatus = Field(default=IncidentStatus.New)
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    mitre_technique: Optional[str] = None
    assigned_user_id: Optional[int] = None
    category: IncidentCategory = Field(default=IncidentCategory.Authentication)
    remediation: Optional[str] = None

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[IncidentSeverity] = None
    status: Optional[IncidentStatus] = None
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    mitre_technique: Optional[str] = None
    assigned_user_id: Optional[int] = None
    category: Optional[IncidentCategory] = None
    remediation: Optional[str] = None

class IncidentResponse(IncidentBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    assigned_user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class IncidentPaginationResponse(BaseModel):
    items: List[IncidentResponse]
    total: int
    page: int
    limit: int
    pages: int

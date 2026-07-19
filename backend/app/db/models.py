import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "Super Admin"
    SOC_ANALYST = "SOC Analyst"
    THREAT_HUNTER = "Threat Hunter"
    VIEWER = "Viewer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.VIEWER)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime, 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="refresh_tokens")

class IncidentSeverity(str, enum.Enum):
    Critical = "Critical"
    High = "High"
    Medium = "Medium"
    Low = "Low"

class IncidentStatus(str, enum.Enum):
    New = "New"
    Investigating = "Investigating"
    Mitigated = "Mitigated"
    Resolved = "Resolved"

class IncidentCategory(str, enum.Enum):
    Authentication = "Authentication"
    Initial_Access = "Initial Access"
    Execution = "Execution"
    Persistence = "Persistence"
    Privilege_Escalation = "Privilege Escalation"
    Defense_Evasion = "Defense Evasion"
    Credential_Access = "Credential Access"
    Discovery = "Discovery"
    Lateral_Movement = "Lateral Movement"
    Collection = "Collection"
    Exfiltration = "Exfiltration"
    Command_and_Control = "Command and Control"

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    severity = Column(Enum(IncidentSeverity), nullable=False, default=IncidentSeverity.Low)
    status = Column(Enum(IncidentStatus), nullable=False, default=IncidentStatus.New)
    source_ip = Column(String, nullable=True)
    destination_ip = Column(String, nullable=True)
    mitre_technique = Column(String, nullable=True)
    assigned_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    category = Column(Enum(IncidentCategory), nullable=False, default=IncidentCategory.Authentication)
    remediation = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    assigned_user = relationship("User")

class SimulationStatus(str, enum.Enum):
    Pending = "Pending"
    Running = "Running"
    Completed = "Completed"
    Failed = "Failed"

class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    status = Column(Enum(SimulationStatus), nullable=False, default=SimulationStatus.Pending)
    initiated_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=False, default=0)
    overall_risk = Column(Integer, nullable=False, default=32)
    incident_count = Column(Integer, nullable=False, default=0)
    risk_score_change = Column(Integer, nullable=False, default=0)
    result = Column(String, nullable=True)

    # Unidirectional relationship to User
    initiated_by_user = relationship("User")
    
    # Bidirectional relationship to SimulationEvent
    events = relationship("SimulationEvent", back_populates="simulation", cascade="all, delete-orphan")

class SimulationEvent(Base):
    __tablename__ = "simulation_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    simulation_id = Column(UUID(as_uuid=True), ForeignKey("simulations.id", ondelete="CASCADE"), nullable=False)
    stage = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    severity = Column(Enum(IncidentSeverity), nullable=False, default=IncidentSeverity.Low)
    mitre_technique = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id", ondelete="SET NULL"), nullable=True)

    simulation = relationship("Simulation", back_populates="events")
    incident = relationship("Incident")


import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.models import Incident, SimulationEvent, IncidentStatus
from app.simulations.mapper import map_severity_to_enum, map_category_to_enum

def create_incident_from_stage(db: Session, stage_data: dict, initiated_by: int) -> Incident:
    """
    Creates and persists an Incident from simulation stage parameters.
    """
    incident = Incident(
        title=stage_data["title"],
        description=stage_data["description"],
        severity=map_severity_to_enum(stage_data["severity"]),
        status=IncidentStatus.New,
        category=map_category_to_enum(stage_data["incident_category"]),
        source_ip=stage_data.get("source_ip"),
        destination_ip=stage_data.get("destination_ip"),
        mitre_technique=stage_data["mitre_technique"],
        assigned_user_id=None,
        remediation=stage_data.get("remediation")
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

def create_simulation_event(
    db: Session,
    simulation_id: uuid.UUID,
    stage_data: dict,
    incident_id: uuid.UUID = None
) -> SimulationEvent:
    """
    Creates and persists a SimulationEvent.
    """
    event = SimulationEvent(
        simulation_id=simulation_id,
        stage=stage_data["stage_number"],
        title=stage_data["title"],
        description=stage_data["description"],
        severity=map_severity_to_enum(stage_data["severity"]),
        mitre_technique=stage_data["mitre_technique"],
        timestamp=datetime.now(timezone.utc),
        incident_id=incident_id
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

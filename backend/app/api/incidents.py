from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.db.database import get_db
from app.db.models import Incident, User
from app.api.auth import get_current_user
from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResponse

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("", response_model=List[IncidentResponse])
def read_incidents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Incident).order_by(Incident.created_at.desc()).all()

@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(
    incident_in: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_incident = Incident(**incident_in.model_dump())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

@router.get("/{id}", response_model=IncidentResponse)
def read_incident(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_incident = db.query(Incident).filter(Incident.id == id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return db_incident

@router.put("/{id}", response_model=IncidentResponse)
def update_incident(
    id: uuid.UUID,
    incident_in: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_incident = db.query(Incident).filter(Incident.id == id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    update_data = incident_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_incident, field, value)
    
    db.commit()
    db.refresh(db_incident)
    return db_incident

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_incident(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_incident = db.query(Incident).filter(Incident.id == id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    db.delete(db_incident)
    db.commit()
    return None

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from app.db.database import get_db
from app.db.models import Incident, User, IncidentSeverity, IncidentStatus, IncidentCategory
from app.api.auth import get_current_user
from app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentResponse, IncidentPaginationResponse
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("/analysts", response_model=List[UserResponse])
def read_analysts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(User).filter(User.is_active == True).all()

@router.get("", response_model=IncidentPaginationResponse)
def read_incidents(
    severity: Optional[IncidentSeverity] = None,
    status: Optional[IncidentStatus] = None,
    category: Optional[IncidentCategory] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Incident)
    
    if severity:
        query = query.filter(Incident.severity == severity)
    if status:
        query = query.filter(Incident.status == status)
    if category:
        query = query.filter(Incident.category == category)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            Incident.title.ilike(search_filter) |
            Incident.description.ilike(search_filter) |
            Incident.source_ip.ilike(search_filter) |
            Incident.destination_ip.ilike(search_filter) |
            Incident.mitre_technique.ilike(search_filter)
        )
        
    total = query.count()
    pages = (total + limit - 1) // limit if limit > 0 else 1
    offset = (page - 1) * limit
    
    items = query.order_by(Incident.created_at.desc()).offset(offset).limit(limit).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

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

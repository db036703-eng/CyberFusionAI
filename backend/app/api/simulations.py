import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db, SessionLocal
from app.db.models import User, Simulation, SimulationStatus, SimulationEvent
from app.api.auth import get_current_user
from app.schemas.simulation import SimulationResponse, SimulationEventResponse, SimulationRunRequest
from app.simulations.scenarios import SCENARIOS
from app.simulations.engine import run_simulation_task

router = APIRouter(prefix="/simulations", tags=["simulations"])

@router.get("/scenarios", response_model=List[dict])
def get_scenarios(
    current_user: User = Depends(get_current_user)
):
    """
    Returns all defined simulation scenarios.
    """
    res = []
    for k, v in SCENARIOS.items():
        res.append({
            "name": v["name"],
            "description": v["description"],
            "estimated_duration": v["estimated_duration"],
            "delay_between_stages": v.get("delay_between_stages", 2),
            "difficulty": v.get("difficulty", "Medium"),
            "recommended_role": v.get("recommended_role", "SOC Analyst"),
            "risk_change": v["risk_change"],
            "primary_mitre_techniques": v.get("primary_mitre_techniques", []),
            "stages": v["stages"]
        })
    return res

@router.post("/run", response_model=SimulationResponse, status_code=status.HTTP_201_CREATED)
def run_simulation(
    payload: SimulationRunRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Launches a safe simulation run by spawning a BackgroundTask.
    """
    scenario_name = payload.scenario_name
    if scenario_name not in SCENARIOS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scenario '{scenario_name}' is not supported. Supported: {list(SCENARIOS.keys())}"
        )
        
    # Check if there's already a simulation running
    running_sim = db.query(Simulation).filter(Simulation.status == SimulationStatus.Running).first()
    if running_sim:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Another simulation '{running_sim.name}' is currently running. Please wait for it to complete."
        )

    # 1. Create Simulation in DB with status Pending
    simulation = Simulation(
        name=scenario_name,
        status=SimulationStatus.Pending,
        initiated_by=current_user.id,
        started_at=datetime.now(timezone.utc),
        duration_seconds=0,
        overall_risk=32,
        incident_count=0,
        risk_score_change=0
    )
    db.add(simulation)
    db.commit()
    db.refresh(simulation)

    # 2. Add engine run to background tasks
    background_tasks.add_task(
        run_simulation_task,
        simulation.id,
        scenario_name,
        current_user.id,
        SessionLocal
    )

    return simulation

@router.get("", response_model=List[SimulationResponse])
def list_simulations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists all simulations sorted by creation time.
    """
    return db.query(Simulation).order_by(Simulation.started_at.desc()).all()

@router.get("/{id}", response_model=SimulationResponse)
def get_simulation(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetches details of a specific simulation.
    """
    simulation = db.query(Simulation).filter(Simulation.id == id).first()
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    return simulation

@router.get("/{id}/events", response_model=List[SimulationEventResponse])
def list_simulation_events(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists all simulation events generated so far for the simulation.
    """
    # Check if simulation exists
    simulation = db.query(Simulation).filter(Simulation.id == id).first()
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    return db.query(SimulationEvent).filter(SimulationEvent.simulation_id == id).order_by(SimulationEvent.stage.asc()).all()

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_simulation(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletes the simulation (cascading automatically to events).
    """
    simulation = db.query(Simulation).filter(Simulation.id == id).first()
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    db.delete(simulation)
    db.commit()
    return

import uuid
import time
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.models import Simulation, SimulationStatus, SimulationEvent
from app.simulations.scenarios import SCENARIOS
from app.simulations.generator import create_simulation_event, create_incident_from_stage

def run_simulation_task(simulation_id: uuid.UUID, scenario_name: str, initiated_by: int, db_session_maker):
    """
    Asynchronous runner executed by BackgroundTasks.
    Iterates through the stages of the selected scenario, creating events/incidents.
    """
    db: Session = db_session_maker()
    try:
        # 1. Fetch and lock the simulation to ensure single-caller execution
        simulation = db.query(Simulation).filter(Simulation.id == simulation_id).with_for_update().first()
        if not simulation:
            db.rollback()
            return
            
        # If simulation is already running, completed, or failed, exit immediately to maintain idempotency
        if simulation.status in (SimulationStatus.Running, SimulationStatus.Completed, SimulationStatus.Failed):
            db.rollback()
            return
            
        simulation.status = SimulationStatus.Running
        db.commit()
        
        scenario = SCENARIOS.get(scenario_name)
        if not scenario:
            # Fetch again to update status
            curr_sim = db.query(Simulation).filter(Simulation.id == simulation_id).first()
            if curr_sim:
                curr_sim.status = SimulationStatus.Failed
                curr_sim.result = f"Scenario '{scenario_name}' not found."
                db.commit()
            return
            
        stages = scenario["stages"]
        incidents_created = 0
        overall_risk = 32
        
        for stage in stages:
            # Check if simulation was deleted in the meantime
            # Use query to be safe from object state refresh issues
            curr_sim = db.query(Simulation).filter(Simulation.id == simulation_id).first()
            if not curr_sim:
                return
                
            # Check if this stage event already exists (to prevent duplicates on restart/duplicate execution)
            existing_event = db.query(SimulationEvent).filter(
                SimulationEvent.simulation_id == simulation_id,
                SimulationEvent.stage == stage["stage_number"]
            ).first()
            
            if existing_event:
                # Reuse the existing incident ID if present
                incident_id = existing_event.incident_id
                if stage["create_incident"] and incident_id:
                    incidents_created += 1
                
                # Still factor this stage's risk into the local risk score calculation
                severity = stage["severity"].lower()
                if severity == "critical":
                    overall_risk = max(overall_risk, 90)
                elif severity == "high":
                    overall_risk = max(overall_risk, 75)
                elif severity == "medium":
                    overall_risk = max(overall_risk, 55)
                    
                continue
                
            incident_id = None
            if stage["create_incident"]:
                incident = create_incident_from_stage(db, stage, initiated_by)
                incident_id = incident.id
                incidents_created += 1
                
                # If incident is created, update local simulation overall risk
                severity = stage["severity"].lower()
                if severity == "critical":
                    overall_risk = max(overall_risk, 90)
                elif severity == "high":
                    overall_risk = max(overall_risk, 75)
                elif severity == "medium":
                    overall_risk = max(overall_risk, 55)
            
            # Create Event record
            create_simulation_event(db, simulation_id, stage, incident_id)
            
            # Update Simulation state dynamically
            curr_sim.overall_risk = overall_risk
            curr_sim.incident_count = incidents_created
            db.commit()
            
            # Delay to simulate progress
            delay = scenario.get("delay_between_stages", 2)
            import os
            if os.getenv("TESTING") == "True" or os.getenv("TESTING") == "true":
                delay = 0
            time.sleep(delay)
            
        # Finalize the simulation
        curr_sim = db.query(Simulation).filter(Simulation.id == simulation_id).first()
        if curr_sim:
            completed_time = datetime.now(timezone.utc)
            if curr_sim.started_at.tzinfo is None:
                completed_time = completed_time.replace(tzinfo=None)
            duration = int((completed_time - curr_sim.started_at).total_seconds())
            
            curr_sim.status = SimulationStatus.Completed
            curr_sim.completed_at = completed_time
            curr_sim.duration_seconds = max(duration, scenario.get("estimated_duration", 6))
            curr_sim.overall_risk = overall_risk
            curr_sim.risk_score_change = scenario.get("risk_change", 30)
            curr_sim.result = f"Simulation scenario '{scenario_name}' completed successfully."
            db.commit()
            
    except Exception as e:
        db.rollback()
        try:
            curr_sim = db.query(Simulation).filter(Simulation.id == simulation_id).first()
            if curr_sim:
                curr_sim.status = SimulationStatus.Failed
                curr_sim.result = f"Failed during execution: {str(e)}"
                db.commit()
        except Exception:
            pass
    finally:
        db.close()

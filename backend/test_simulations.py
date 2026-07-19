import sys
import os
from datetime import datetime, timezone

# Ensure backend imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set TESTING environment variable to bypass delays
os.environ["TESTING"] = "True"

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import Base
from app.db.models import User, UserRole, Incident, Simulation, SimulationEvent, SimulationStatus, IncidentSeverity, IncidentCategory
from app.simulations.engine import run_simulation_task
from app.simulations.scenarios import SCENARIOS

# A session wrapper to keep the test session open when background task calls db.close()
class TestSessionWrapper:
    def __init__(self, session):
        self.session = session
        
    def __getattr__(self, name):
        return getattr(self.session, name)
        
    def close(self):
        # Do not close the session in the test case
        pass

def test_simulation_flow():
    print("Starting Simulation Engine integration tests...")
    
    # 1. Initialize SQLite in-memory database
    print("Configuring local in-memory SQLite database...")
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    
    try:
        # 2. Seed a test SOC Analyst User
        user = User(
            username="analyst_test",
            email="analyst@cyberfusion.ai",
            hashed_password="hashed_password_placeholder",
            role=UserRole.SOC_ANALYST,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        assert user.id is not None
        print(f"[OK] Test user registered successfully (ID: {user.id}).")
        
        # 3. Create a Simulation record in Pending state
        scenario_name = "SSH Brute Force"
        
        simulation = Simulation(
            name=scenario_name,
            status=SimulationStatus.Pending,
            initiated_by=user.id,
            started_at=datetime.now(timezone.utc),
            duration_seconds=0,
            overall_risk=32,
            incident_count=0,
            risk_score_change=0
        )
        db.add(simulation)
        db.commit()
        db.refresh(simulation)
        
        sim_id = simulation.id
        assert sim_id is not None
        assert simulation.status == SimulationStatus.Pending
        print(f"[OK] Created Simulation record in Pending state (ID: {sim_id}).")
        
        # 4. Execute the simulation task using our Session wrapper
        print("Executing simulation task run_simulation_task (running with TESTING=True, delay=0)...")
        session_wrapper = TestSessionWrapper(db)
        run_simulation_task(sim_id, scenario_name, user.id, lambda: session_wrapper)
        
        # 5. Refresh our local object reference from db
        db.refresh(simulation)
        
        # Verify results
        print(f"DEBUG: Status={simulation.status}, Result={simulation.result}")
        assert simulation.status == SimulationStatus.Completed
        assert simulation.incident_count == 1  # 3rd stage triggers an incident
        assert simulation.overall_risk == 75   # Stage 3 is high severity -> max(32, 75) = 75
        assert simulation.risk_score_change == 40  # risk_change is 40
        assert simulation.duration_seconds >= 6
        print("[OK] Simulation status updated to Completed with correct risk and duration values.")
        
        # 6. Verify simulation events
        events = db.query(SimulationEvent).filter(SimulationEvent.simulation_id == sim_id).all()
        assert len(events) == 3
        print(f"[OK] Generated {len(events)} SimulationEvents successfully.")
        
        # Check specific stage details
        stage_1_event = next(e for e in events if e.stage == 1)
        assert stage_1_event.title == "Port Scanning & Reconnaissance"
        assert stage_1_event.severity == IncidentSeverity.Low
        assert stage_1_event.incident_id is None
        
        stage_3_event = next(e for e in events if e.stage == 3)
        assert stage_3_event.title == "Successful Ingress Login"
        assert stage_3_event.severity == IncidentSeverity.High
        assert stage_3_event.incident_id is not None
        print("[OK] SimulationEvents mapped correctly to stage parameters.")
        
        # 7. Verify generated Incident record
        incident = db.query(Incident).filter(Incident.id == stage_3_event.incident_id).first()
        assert incident is not None
        assert incident.title == "Successful Ingress Login"
        assert incident.severity == IncidentSeverity.High
        assert incident.category == IncidentCategory.Credential_Access
        assert incident.source_ip == "198.51.100.12"
        assert incident.mitre_technique == "T1078.002"
        assert "disable password-based root SSH logins" in incident.remediation
        print(f"[OK] Incident record created successfully with correct fields (ID: {incident.id}).")
        
        # 8. Verify Dashboard summary logic
        latest_sim = db.query(Simulation).order_by(Simulation.started_at.desc()).first()
        assert latest_sim is not None
        risk_score = latest_sim.overall_risk
        assert risk_score == 75
        print("[OK] Dashboard Summary Organization Risk updates correctly to simulated risk score.")
        
        # 9. Verify Cascade Deletion
        print("Deleting Simulation record to verify cascade deletion...")
        db.delete(simulation)
        db.commit()
        
        # Verify events are deleted
        deleted_events = db.query(SimulationEvent).filter(SimulationEvent.simulation_id == sim_id).all()
        assert len(deleted_events) == 0
        print("[OK] SimulationEvents cascade-deleted successfully.")
        
        # Verify incident remains intact
        incident_after_delete = db.query(Incident).filter(Incident.id == incident.id).first()
        assert incident_after_delete is not None
        print("[OK] Independent Incident record remained intact in database.")
        
        print("All simulation engine integration tests passed successfully!")
        
    finally:
        db.close()

def test_simulation_idempotency():
    print("Starting Simulation Engine idempotency tests...")
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    
    try:
        # Seed a test User
        user = User(
            username="analyst_test_idem",
            email="analyst_idem@cyberfusion.ai",
            hashed_password="hashed_password_placeholder",
            role=UserRole.SOC_ANALYST,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        scenario_name = "SSH Brute Force"
        
        # Create Simulation in Pending
        simulation = Simulation(
            name=scenario_name,
            status=SimulationStatus.Pending,
            initiated_by=user.id,
            started_at=datetime.now(timezone.utc),
            duration_seconds=0,
            overall_risk=32,
            incident_count=0,
            risk_score_change=0
        )
        db.add(simulation)
        db.commit()
        db.refresh(simulation)
        sim_id = simulation.id
        
        # Invoke task once
        print("Invoking task first time...")
        session_wrapper = TestSessionWrapper(db)
        run_simulation_task(sim_id, scenario_name, user.id, lambda: session_wrapper)
        
        db.refresh(simulation)
        assert simulation.status == SimulationStatus.Completed
        assert simulation.incident_count == 1
        
        events_first_run = db.query(SimulationEvent).filter(SimulationEvent.simulation_id == sim_id).all()
        assert len(events_first_run) == 3
        
        # Reset status to Running and invoke task a second time (re-run)
        print("Resetting simulation status to Running and invoking task a second time...")
        simulation.status = SimulationStatus.Running
        db.commit()
        
        run_simulation_task(sim_id, scenario_name, user.id, lambda: session_wrapper)
        
        db.refresh(simulation)
        events_second_run = db.query(SimulationEvent).filter(SimulationEvent.simulation_id == sim_id).all()
        assert len(events_second_run) == 3  # Remaining 3, not duplicating to 6!
        
        total_incidents = db.query(Incident).count()
        assert total_incidents == 1  # Remaining 1, not duplicating!
        print("[OK] Re-run did not create duplicate events or incidents.")
        
        # Test concurrent invocation prevention
        print("Invoking task on a completed simulation...")
        simulation.status = SimulationStatus.Completed
        db.commit()
        
        run_simulation_task(sim_id, scenario_name, user.id, lambda: session_wrapper)
        db.refresh(simulation)
        assert len(db.query(SimulationEvent).filter(SimulationEvent.simulation_id == sim_id).all()) == 3
        assert db.query(Incident).count() == 1
        print("[OK] Completed status checks exit immediately.")
        
        print("All simulation engine idempotency tests passed successfully!")
        
    finally:
        db.close()

if __name__ == "__main__":
    test_simulation_flow()
    test_simulation_idempotency()

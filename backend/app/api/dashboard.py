# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import time
from app.db.database import get_db
from app.db.models import Incident, User, IncidentSeverity, IncidentStatus
from app.api.auth import get_current_user
from app.schemas.dashboard import DashboardSummary, SystemHealth, ThreatFeedItem
from app.schemas.incident import IncidentResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

START_TIME = time.time()

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incidents = db.query(Incident).all()
    critical_incidents = len([
        i for i in incidents 
        if (i.severity == IncidentSeverity.Critical or getattr(i.severity, 'value', None) == 'Critical' or i.severity == 'critical') 
        and (i.status not in (IncidentStatus.Resolved, IncidentStatus.Mitigated) and getattr(i.status, 'value', None) not in ('Resolved', 'Mitigated') and i.status not in ('resolved', 'mitigated'))
    ])
    open_incidents = len([
        i for i in incidents 
        if (i.status in (IncidentStatus.New, IncidentStatus.Investigating) or getattr(i.status, 'value', None) in ('New', 'Investigating') or i.status in ('active', 'investigating', 'new'))
    ])
    
    # Calculate organization risk index based on latest simulation or critical incidents count
    from app.db.models import Simulation
    latest_sim = db.query(Simulation).order_by(Simulation.started_at.desc()).first()
    if latest_sim:
        risk_score = latest_sim.overall_risk
    else:
        risk_score = 32
        if critical_incidents > 0:
            risk_score = 72
        
    return DashboardSummary(
        organization_risk=risk_score,
        critical_incidents=critical_incidents,
        open_incidents=open_incidents,
        ioc_matches=412,
        threat_feed_health="99.8%",
        ai_confidence="94.2%"
    )

@router.get("/recent-incidents", response_model=List[IncidentResponse])
def get_recent_incidents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retrieve 3 most recent incidents
    return db.query(Incident).order_by(Incident.created_at.desc()).limit(3).all()

@router.get("/system-health", response_model=SystemHealth)
def get_system_health(
    db: Session = Depends(get_db)
):
    db_connected = True
    try:
        db.execute("SELECT 1")
    except Exception:
        db_connected = False
        
    status = "healthy" if db_connected else "unhealthy"
    uptime = int(time.time() - START_TIME)
    
    return SystemHealth(
        status=status,
        db_connected=db_connected,
        uptime_seconds=uptime
    )

@router.get("/threat-feed", response_model=List[ThreatFeedItem])
def get_threat_feed(
    current_user: User = Depends(get_current_user)
):
    return [
        ThreatFeedItem(
            id="CVE-2026-3011",
            source="NVD Registry",
            indicator="CVSS 9.8: RCE in enterprise directory authentication services",
            severity="critical",
            timestamp="10m ago",
            status="Active Scan"
        ),
        ThreatFeedItem(
            id="IP-MALICIOUS",
            source="CrowdStrike Intelligence",
            indicator="Host 198.51.100.12 tagged as active SSH brute force agent",
            severity="critical",
            timestamp="30m ago",
            status="Blocked"
        ),
        ThreatFeedItem(
            id="RANSOMWARE-SIG",
            source="AlienVault OTX",
            indicator="LockBit v4 malware variant file hashes registered in threat vaults",
            severity="warning",
            timestamp="2h ago",
            status="Ingested"
        ),
        ThreatFeedItem(
            id="IOC-DOMAIN",
            source="SentinelOne Feed",
            indicator="Exfiltration DNS proxy endpoint dga-exfil.xyz blocked",
            severity="info",
            timestamp="4h ago",
            status="Blocked"
        )
    ]

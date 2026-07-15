from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, auth, incidents, dashboard
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

# CORS middleware for communication with the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(incidents.router)
app.include_router(dashboard.router)

@app.on_event("startup")
def seed_data():
    from app.db.database import SessionLocal
    from app.db.models import Incident
    db = SessionLocal()
    try:
        if db.query(Incident).count() == 0:
            default_incidents = [
                Incident(
                    title="Adversary Bruteforce on DB Node",
                    severity="critical",
                    status="active",
                    source_ip="10.0.4.82",
                    category="Authentication",
                    description="Multiple failed ssh attempts detected on core postgres server from external IP block 198.51.100.12. Critical database credentials at risk.",
                    remediation="Apply firewall drop rule for CIDR block 198.51.100.0/24 and force credentials cycle for the postgres root user."
                ),
                Incident(
                    title="Anomalous Data Exfiltration DNS Queries",
                    severity="warning",
                    status="investigating",
                    source_ip="10.0.12.14",
                    category="Data Exfiltration",
                    description="High frequency of custom sub-domain queries matching encryption formats pointing to an unverified external DNS server.",
                    remediation="Quarantine server 10.0.12.14 and route DNS inquiries through standard internal server validators."
                ),
                Incident(
                    title="Phishing Campaign Link Executed",
                    severity="critical",
                    status="active",
                    source_ip="Workstation-HR-04",
                    category="Enduser Infiltration",
                    description="HR Workstation user opened custom email hyperlink download executing powershell runner script with active memory injection.",
                    remediation="Revoke active AD sessions for employee ID HR-04, disconnect workstation HR-04 from company VPN."
                ),
                Incident(
                    title="AWS Security Group Wildcard Ingress",
                    severity="info",
                    status="mitigated",
                    source_ip="Cloud-Prod-01",
                    category="Compliance",
                    description="AWS security group changed dynamically from console exposing database ingress socket to wildcard 0.0.0.0/0.",
                    remediation="Reverted security group ingress properties using AWS Config automated terraform mitigation script."
                ),
                Incident(
                    title="Kubernetes Container Root Drift Detected",
                    severity="warning",
                    status="resolved",
                    source_ip="K8s-Cluster-Node-02",
                    category="Container Security",
                    description="Container binary hashes mismatched against docker repository manifest indicating file write inside read-only layers.",
                    remediation="Restructured Kubernetes deployment setting ReadOnlyRootFilesystem=true. Redeployed deployment pods."
                )
            ]
            db.bulk_save_objects(default_incidents)
            db.commit()
    except Exception as e:
        print("Database seeding exception encountered:", e)
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


import sys
import os
from datetime import datetime, timezone, timedelta
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.models import Incident, User, IncidentSeverity, IncidentStatus, IncidentCategory

def seed():
    print("Connecting to database...")
    engine = create_engine(settings.get_database_url)
    Session = sessionmaker(bind=engine)
    db = Session()
    
    try:
        # Check if users table is seeded
        users = db.query(User).all()
        if not users:
            print("No users found in database! Please register or seed users first.")
            return
            
        user_ids = [u.id for u in users]
        print(f"Found user IDs for assignment: {user_ids}")
        
        # Clear existing incidents to ensure clean slate
        print("Clearing existing incidents...")
        db.query(Incident).delete()
        db.commit()
        
        print("Generating 25 realistic cybersecurity incidents...")
        
        now = datetime.now(timezone.utc)
        
        incidents_data = [
            # 1. SSH Brute Force
            {
                "title": "SSH Brute Force Attack on Bastion Host",
                "description": "Repetitive failed login attempts detected on port 22 of the primary bastion host. IP address originated from known threat actor proxy list.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.Investigating,
                "category": IncidentCategory.Credential_Access,
                "source_ip": "198.51.100.12",
                "destination_ip": "10.0.1.5",
                "mitre_technique": "T1110 (Brute Force)",
                "assigned_user_id": user_ids[1] if len(user_ids) > 1 else user_ids[0],
                "remediation": "Block source IP 198.51.100.12 at firewall level. Enable rate limiting on bastion host SSH configuration.",
                "created_at": now - timedelta(hours=2)
            },
            # 2. DNS Tunneling
            {
                "title": "Anomalous DNS Tunneling Activity",
                "description": "High volume of TXT queries to dynamic DGA domain indicating possible command-and-control channel or data exfiltration over DNS.",
                "severity": IncidentSeverity.Critical,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Command_and_Control,
                "source_ip": "10.0.2.14",
                "destination_ip": "8.8.8.8",
                "mitre_technique": "T1071.004 (DNS Protocol)",
                "assigned_user_id": None,
                "remediation": "Quarantine source host 10.0.2.14. Re-route DNS traffic through internal filtering firewall.",
                "created_at": now - timedelta(hours=4)
            },
            # 3. PowerShell Execution
            {
                "title": "Suspicious PowerShell Execution",
                "description": "PowerShell command execution containing base64 encoded payload and net.webclient download string detected on HR workstation.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Execution,
                "source_ip": "10.0.12.82",
                "destination_ip": "185.220.101.5",
                "mitre_technique": "T1059.001 (PowerShell)",
                "assigned_user_id": user_ids[0],
                "remediation": "Isolate HR workstation 10.0.12.82. Collect memory dump for analyst containment audit.",
                "created_at": now - timedelta(hours=6)
            },
            # 4. Credential Dumping
            {
                "title": "LSASS Memory Dump Attempt",
                "description": "Access request to Local Security Authority Subsystem Service (LSASS) memory space by unverified backup utility executable.",
                "severity": IncidentSeverity.Critical,
                "status": IncidentStatus.Investigating,
                "category": IncidentCategory.Credential_Access,
                "source_ip": "10.0.3.11",
                "destination_ip": None,
                "mitre_technique": "T1003.001 (LSASS Memory)",
                "assigned_user_id": user_ids[1] if len(user_ids) > 1 else user_ids[0],
                "remediation": "Lock admin credentials for compromise validation. Enable credential guard on source endpoint.",
                "created_at": now - timedelta(hours=12)
            },
            # 5. Phishing Email
            {
                "title": "Phishing Email Link Execution",
                "description": "User clicked on a URL linked in a spoofed billing notification email. Endpoint reached out to dynamic DNS host.",
                "severity": IncidentSeverity.Medium,
                "status": IncidentStatus.Mitigated,
                "category": IncidentCategory.Initial_Access,
                "source_ip": "10.0.15.54",
                "destination_ip": "203.0.113.88",
                "mitre_technique": "T1566.002 (Spearphishing Link)",
                "assigned_user_id": user_ids[0],
                "remediation": "Revoke active web sessions for user. Update email gateway filter configurations.",
                "created_at": now - timedelta(hours=18)
            },
            # 6. Lateral Movement
            {
                "title": "Lateral Movement via WinRM",
                "description": "Windows Remote Management connection established from staging host to core application node using admin token hash.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Lateral_Movement,
                "source_ip": "10.0.4.5",
                "destination_ip": "10.0.4.50",
                "mitre_technique": "T1021.002 (SMB/Windows Admin Shares)",
                "assigned_user_id": None,
                "remediation": "Restrict WinRM listener rules to trusted management hosts only. Reset admin hash values.",
                "created_at": now - timedelta(days=1, hours=2)
            },
            # 7. Suspicious RDP
            {
                "title": "Suspicious RDP Login Attempt",
                "description": "Inbound Remote Desktop connection detected from unmanaged subnet using local administrator account credentials.",
                "severity": IncidentSeverity.Medium,
                "status": IncidentStatus.Resolved,
                "category": IncidentCategory.Lateral_Movement,
                "source_ip": "10.0.99.15",
                "destination_ip": "10.0.1.20",
                "mitre_technique": "T1021.001 (Remote Desktop Protocol)",
                "assigned_user_id": user_ids[0],
                "remediation": "Re-enable central AD authentication policies. Re-audit RDP group policies.",
                "created_at": now - timedelta(days=1, hours=6)
            },
            # 8. Ransomware Activity
            {
                "title": "Ransomware File Encryption Signature",
                "description": "Rapid modification of files with custom extensions (.locked) detected on marketing file sharing directory.",
                "severity": IncidentSeverity.Critical,
                "status": IncidentStatus.Mitigated,
                "category": IncidentCategory.Execution,
                "source_ip": "10.0.12.30",
                "destination_ip": "10.0.5.100",
                "mitre_technique": "T1486 (Data Encrypted for Impact)",
                "assigned_user_id": user_ids[1] if len(user_ids) > 1 else user_ids[0],
                "remediation": "Disable network interface on host 10.0.12.30. Restore files from backup snapshots.",
                "created_at": now - timedelta(days=1, hours=12)
            },
            # 9. Impossible Travel Login
            {
                "title": "Impossible Travel Login Detected",
                "description": "Successful VPN logins detected for same user account from Paris, FR and Tokyo, JP within a 45-minute window.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Authentication,
                "source_ip": "185.190.140.2",
                "destination_ip": "10.0.1.250",
                "mitre_technique": "T1078 (Valid Accounts)",
                "assigned_user_id": None,
                "remediation": "Force reset user password and trigger multi-factor authentication enrollment update.",
                "created_at": now - timedelta(days=1, hours=18)
            },
            # 10. Privilege Escalation
            {
                "title": "Local Privilege Escalation via Token Manipulation",
                "description": "Standard user context elevated dynamically to NT AUTHORITY/SYSTEM context using access token manipulation on utility server.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.Investigating,
                "category": IncidentCategory.Privilege_Escalation,
                "source_ip": "10.0.3.15",
                "destination_ip": None,
                "mitre_technique": "T1134 (Access Token Manipulation)",
                "assigned_user_id": user_ids[0],
                "remediation": "Apply security patch KB5001340 to address system exploit vulnerability. Revoke admin context.",
                "created_at": now - timedelta(days=2)
            },
            # 11. Malicious Persistence
            {
                "title": "Scheduled Task Persistence Created",
                "description": "A new scheduled task named 'SystemUpdatesCheck' created under NT AUTHORITY/SYSTEM executing binary from temporary folder.",
                "severity": IncidentSeverity.Medium,
                "status": IncidentStatus.Resolved,
                "category": IncidentCategory.Persistence,
                "source_ip": "10.0.12.44",
                "destination_ip": None,
                "mitre_technique": "T1053.005 (Scheduled Task)",
                "assigned_user_id": user_ids[0],
                "remediation": "Delete scheduled task. Delete target binary from C:\\Windows\\Temp\\.",
                "created_at": now - timedelta(days=2, hours=4)
            },
            # 12. Defense Evasion
            {
                "title": "Windows Defender Log Clearing",
                "description": "Windows Security log entries cleared using wevtutil utility command by local console administrator.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Defense_Evasion,
                "source_ip": "10.0.2.110",
                "destination_ip": None,
                "mitre_technique": "T1070.001 (Clear Windows Event Logs)",
                "assigned_user_id": None,
                "remediation": "Quarantine host. Verify audit logs from centralized SIEM endpoint.",
                "created_at": now - timedelta(days=2, hours=12)
            },
            # 13. Exfiltration
            {
                "title": "Bulk Database Exfiltration via HTTPS",
                "description": "Unusually high data transfer volume (15GB) directed to external mega-hosting IP block from production database replication node.",
                "severity": IncidentSeverity.Critical,
                "status": IncidentStatus.Investigating,
                "category": IncidentCategory.Exfiltration,
                "source_ip": "10.0.1.100",
                "destination_ip": "84.200.41.10",
                "mitre_technique": "T1048.002 (Exfiltration Over Alternative Protocol)",
                "assigned_user_id": user_ids[1] if len(user_ids) > 1 else user_ids[0],
                "remediation": "Block output network packets to destination IP block. Re-audit database endpoint API keys.",
                "created_at": now - timedelta(days=3)
            },
            # 14. Network Discovery
            {
                "title": "Internal Subnet Port Sweep",
                "description": "Rapid ping sweep and TCP SYN port scan targeting range 10.0.5.1/24 originating from internal developer server.",
                "severity": IncidentSeverity.Medium,
                "status": IncidentStatus.Mitigated,
                "category": IncidentCategory.Discovery,
                "source_ip": "10.0.5.12",
                "destination_ip": "10.0.5.0/24",
                "mitre_technique": "T1046 (Network Service Scanning)",
                "assigned_user_id": user_ids[0],
                "remediation": "Identify scanning process on developer host. Lock local process execution privileges.",
                "created_at": now - timedelta(days=3, hours=6)
            },
            # 15. Persistence via Registry
            {
                "title": "Registry Run Keys Modification",
                "description": "Unapproved registry modification adding executable path under HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run.",
                "severity": IncidentSeverity.Medium,
                "status": IncidentStatus.Resolved,
                "category": IncidentCategory.Persistence,
                "source_ip": "10.0.10.15",
                "destination_ip": None,
                "mitre_technique": "T1547.001 (Registry Run Keys / Startup Folder)",
                "assigned_user_id": user_ids[0],
                "remediation": "Remove registry entry and locate target setup executable. Deploy endpoint configuration check.",
                "created_at": now - timedelta(days=3, hours=12)
            },
            # 16. Threat Actor Web Shell
            {
                "title": "Web Shell Execution detected on DMZ Server",
                "description": "HTTP request patterns matching known web shell signatures (China Chopper) executing commands on web application logs.",
                "severity": IncidentSeverity.Critical,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Initial_Access,
                "source_ip": "45.89.200.12",
                "destination_ip": "10.0.1.10",
                "mitre_technique": "T1505.003 (Web Shell)",
                "assigned_user_id": None,
                "remediation": "Isolate frontend server. Delete web shell script from app templates folder.",
                "created_at": now - timedelta(days=4)
            },
            # 17. Defense Evasion via DLL
            {
                "title": "Process Injection DLL Hijacking",
                "description": "System binary loaded unverified DLL from non-system location (temp application workspace) executing shellcode.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.Investigating,
                "category": IncidentCategory.Defense_Evasion,
                "source_ip": "10.0.2.40",
                "destination_ip": None,
                "mitre_technique": "T1574.001 (DLL Search Order Hijacking)",
                "assigned_user_id": user_ids[1] if len(user_ids) > 1 else user_ids[0],
                "remediation": "Reset folder permissions to administrator-only write. Re-verify hashes of binary components.",
                "created_at": now - timedelta(days=4, hours=6)
            },
            # 18. Account Discovery
            {
                "title": "Domain Account Querying",
                "description": "Unusual bulk net group 'Domain Admins' /domain querying patterns from guest wireless subnet endpoint.",
                "severity": IncidentSeverity.Medium,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Discovery,
                "source_ip": "10.0.40.85",
                "destination_ip": "10.0.1.2",
                "mitre_technique": "T1087.002 (Domain Account)",
                "assigned_user_id": None,
                "remediation": "De-authenticate guest subnet device from corporate network controller. Review guest access policies.",
                "created_at": now - timedelta(days=4, hours=12)
            },
            # 19. Data Collection
            {
                "title": "Automated Archive Email Collection",
                "description": "Search scripting commands targeting Outlook .PST files and bulk copy processes running on HR manager laptop.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.Mitigated,
                "category": IncidentCategory.Collection,
                "source_ip": "10.0.12.15",
                "destination_ip": None,
                "mitre_technique": "T1114.001 (Local Email)",
                "assigned_user_id": user_ids[0],
                "remediation": "Lock email user context access. Re-verify laptop configuration parameters.",
                "created_at": now - timedelta(days=5)
            },
            # 20. MFA Bypass
            {
                "title": "MFA Session Hijacking Threat",
                "description": "Browser session token reuse from geolocation block indicating possible evilginx framework deployment.",
                "severity": IncidentSeverity.Critical,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Authentication,
                "source_ip": "82.102.23.4",
                "destination_ip": "10.0.1.250",
                "mitre_technique": "T1539 (Use Alternate Authentication Material)",
                "assigned_user_id": None,
                "remediation": "Revoke all active access sessions for the target user globally. Set user security profile to strict MFA.",
                "created_at": now - timedelta(days=5, hours=6)
            },
            # 21. Drive-by Download
            {
                "title": "Drive-by Compromise Inbound Files",
                "description": "Executable download trigger from unclassified software distribution server initiated on browser background threads.",
                "severity": IncidentSeverity.Medium,
                "status": IncidentStatus.Resolved,
                "category": IncidentCategory.Initial_Access,
                "source_ip": "10.0.10.82",
                "destination_ip": "185.112.145.8",
                "mitre_technique": "T1189 (Drive-by Compromise)",
                "assigned_user_id": user_ids[0],
                "remediation": "Deploy proxy content blocks for destination domains. Run full antivirus check on endpoint.",
                "created_at": now - timedelta(days=5, hours=12)
            },
            # 22. Lateral Movement WMI
            {
                "title": "Suspicious WMI Process Execution",
                "description": "Windows Management Instrumentation (WMI) queries used to launch powershell scripts on client workstations.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.Investigating,
                "category": IncidentCategory.Lateral_Movement,
                "source_ip": "10.0.2.15",
                "destination_ip": "10.0.12.55",
                "mitre_technique": "T1047 (Windows Management Instrumentation)",
                "assigned_user_id": user_ids[1] if len(user_ids) > 1 else user_ids[0],
                "remediation": "Configure host firewalls to block remote WMI calls. Re-audit WMI group authorization settings.",
                "created_at": now - timedelta(days=6)
            },
            # 23. Port Knocking C2
            {
                "title": "Port Knocking Connection Signature",
                "description": "Sequences of inbound connection requests on closed diagnostic ports indicating potential port-knocking configuration.",
                "severity": IncidentSeverity.Medium,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Command_and_Control,
                "source_ip": "79.142.95.88",
                "destination_ip": "10.0.1.5",
                "mitre_technique": "T1205 (Traffic Signaling)",
                "assigned_user_id": None,
                "remediation": "Configure network logs to report scanning IP addresses. Enable stateful firewall filter rules.",
                "created_at": now - timedelta(days=6, hours=6)
            },
            # 24. Suspicious Cron Modification
            {
                "title": "Suspicious Cron Job Registered",
                "description": "A new system cron job added under /etc/cron.d/ executing base64 decode processes every hour.",
                "severity": IncidentSeverity.High,
                "status": IncidentStatus.Resolved,
                "category": IncidentCategory.Persistence,
                "source_ip": "10.0.1.12",
                "destination_ip": None,
                "mitre_technique": "T1053.003 (Cron)",
                "assigned_user_id": user_ids[0],
                "remediation": "Delete cron job. Re-audit admin permissions to edit cron folders.",
                "created_at": now - timedelta(days=6, hours=12)
            },
            # 25. Process Hollowing
            {
                "title": "Process Hollowing Shellcode Execution",
                "description": "Svchost.exe memory hollowing detected with thread context redirected to unverified code space on billing database server.",
                "severity": IncidentSeverity.Critical,
                "status": IncidentStatus.New,
                "category": IncidentCategory.Defense_Evasion,
                "source_ip": "10.0.3.50",
                "destination_ip": None,
                "mitre_technique": "T1055.012 (Process Hollowing)",
                "assigned_user_id": None,
                "remediation": "Isolate billing database server. Execute endpoint response playbook.",
                "created_at": now - timedelta(days=7)
            }
        ]
        
        for data in incidents_data:
            incident = Incident(**data)
            db.add(incident)
            
        db.commit()
        print("Successfully seeded 25 realistic cybersecurity incidents!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()

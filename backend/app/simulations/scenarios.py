SCENARIOS = {
    "SSH Brute Force": {
        "name": "SSH Brute Force",
        "description": "Simulates brute force authentication attempts on SSH gateway servers.",
        "estimated_duration": 6,
        "risk_change": 40,
        "delay_between_stages": 2,
        "difficulty": "Medium",
        "recommended_role": "SOC Analyst",
        "primary_mitre_techniques": ["T1595.001", "T1110.001", "T1078.002"],
        "stages": [
            {
                "stage_number": 1,
                "title": "Port Scanning & Reconnaissance",
                "description": "External IP scans SSH Port 22 looking for responsive gateways.",
                "severity": "Low",
                "mitre_technique": "T1595.001",
                "incident_category": "Discovery",
                "create_incident": False
            },
            {
                "stage_number": 2,
                "title": "Password Guessing Storm",
                "description": "High-volume connection requests attempt login for user 'root'.",
                "severity": "Medium",
                "mitre_technique": "T1110.001",
                "incident_category": "Credential Access",
                "create_incident": False
            },
            {
                "stage_number": 3,
                "title": "Successful Ingress Login",
                "description": "Dictionary match succeeds. Remote terminal shell spawned on target host.",
                "severity": "High",
                "mitre_technique": "T1078.002",
                "incident_category": "Credential Access",
                "create_incident": True,
                "source_ip": "198.51.100.12",
                "remediation": "Block attacker IP 198.51.100.12, disable password-based root SSH logins, cycle admin credentials."
            }
        ]
    },
    "Phishing Campaign": {
        "name": "Phishing Campaign",
        "description": "Simulates spearphishing link executions leading to harvested user credentials.",
        "estimated_duration": 6,
        "risk_change": 30,
        "delay_between_stages": 2,
        "difficulty": "Medium",
        "recommended_role": "SOC Analyst",
        "primary_mitre_techniques": ["T1566.001", "T1204.001", "T1566.002"],
        "stages": [
            {
                "stage_number": 1,
                "title": "Inbound Billing Phish Delivery",
                "description": "Spoofed invoice notifications delivered to accounting workstation user accounts.",
                "severity": "Low",
                "mitre_technique": "T1566.001",
                "incident_category": "Initial Access",
                "create_incident": False
            },
            {
                "stage_number": 2,
                "title": "Unapproved Link Interaction",
                "description": "User clicks link redirecting browser traffic to an external clone portal.",
                "severity": "Medium",
                "mitre_technique": "T1204.001",
                "incident_category": "Initial Access",
                "create_incident": False
            },
            {
                "stage_number": 3,
                "title": "Corporate Credentials Harvested",
                "description": "Corporate Active Directory password and MFA token input recorded on harvested site.",
                "severity": "High",
                "mitre_technique": "T1566.002",
                "incident_category": "Credential Access",
                "create_incident": True,
                "source_ip": "10.0.15.54",
                "destination_ip": "203.0.113.88",
                "remediation": "Force reset AD passwords, terminate active VPN token sessions, update gateway URL block filters."
            }
        ]
    },
    "PowerShell Execution": {
        "name": "PowerShell Execution",
        "description": "Simulates local PowerShell shell execution pulling downstream payloads.",
        "estimated_duration": 6,
        "risk_change": 35,
        "delay_between_stages": 2,
        "difficulty": "High",
        "recommended_role": "Threat Hunter",
        "primary_mitre_techniques": ["T1059.001", "T1105"],
        "stages": [
            {
                "stage_number": 1,
                "title": "Obfuscated Command Invocation",
                "description": "PowerShell.exe executed with base64 encoded flag arguments on developer laptop.",
                "severity": "Medium",
                "mitre_technique": "T1059.001",
                "incident_category": "Execution",
                "create_incident": False
            },
            {
                "stage_number": 2,
                "title": "External Payload Downloader",
                "description": "Script invokes System.Net.WebClient pulling auxiliary modules from external endpoints.",
                "severity": "High",
                "mitre_technique": "T1105",
                "incident_category": "Command and Control",
                "create_incident": True,
                "source_ip": "10.0.12.82",
                "destination_ip": "185.220.101.5",
                "remediation": "Isolate workstation 10.0.12.82, run antivirus scanning script, audit local endpoint launch logs."
            }
        ]
    },
    "Credential Dumping": {
        "name": "Credential Dumping",
        "description": "Simulates memory access scans targeting local Windows credential stores.",
        "estimated_duration": 6,
        "risk_change": 50,
        "delay_between_stages": 2,
        "difficulty": "Critical",
        "recommended_role": "Threat Hunter",
        "primary_mitre_techniques": ["T1003.001", "T1003.002"],
        "stages": [
            {
                "stage_number": 1,
                "title": "Process Handle Acquisition",
                "description": "Diagnostic utilities trigger handle read operations targeting system security authority (lsass.exe).",
                "severity": "Medium",
                "mitre_technique": "T1003.001",
                "incident_category": "Credential Access",
                "create_incident": False
            },
            {
                "stage_number": 2,
                "title": "Local Security Account Dump",
                "description": "System registry hives or LSASS memory blocks copied to localized temp workspace folders.",
                "severity": "Critical",
                "mitre_technique": "T1003.002",
                "incident_category": "Credential Access",
                "create_incident": True,
                "source_ip": "10.0.3.11",
                "remediation": "Deploy Windows Credential Guard policies, cycle domain administrator hashes, quarantine host 10.0.3.11."
            }
        ]
    },
    "DNS Tunneling": {
        "name": "DNS Tunneling",
        "description": "Simulates command-and-control beacon tunnels routing data inside raw DNS query TXT formats.",
        "estimated_duration": 6,
        "risk_change": 45,
        "delay_between_stages": 2,
        "difficulty": "Critical",
        "recommended_role": "Threat Hunter",
        "primary_mitre_techniques": ["T1071.004", "T1071"],
        "stages": [
            {
                "stage_number": 1,
                "title": "High Entropy Subdomain Queries",
                "description": "System records spikes in base64/hex subdomain queries matching Domain Generation Algorithms.",
                "severity": "Medium",
                "mitre_technique": "T1071.004",
                "incident_category": "Command and Control",
                "create_incident": False
            },
            {
                "stage_number": 2,
                "title": "Interactive Channel Spawned",
                "description": "Bidirectional beacon exchange established routing payload scripts within DNS TXT queries.",
                "severity": "Critical",
                "mitre_technique": "T1071",
                "incident_category": "Command and Control",
                "create_incident": True,
                "source_ip": "10.0.2.14",
                "destination_ip": "8.8.8.8",
                "remediation": "Apply DNS Sinkhole configurations for queries matching dga-exfil.xyz, quarantine infected host."
            }
        ]
    },
    "Lateral Movement": {
        "name": "Lateral Movement",
        "description": "Simulates administrative remote shares query attempts moving between core database nodes.",
        "estimated_duration": 6,
        "risk_change": 40,
        "delay_between_stages": 2,
        "difficulty": "High",
        "recommended_role": "SOC Analyst",
        "primary_mitre_techniques": ["T1021.002", "T1021.001"],
        "stages": [
            {
                "stage_number": 1,
                "title": "Internal Workstation Probing",
                "description": "WinRM remote network queries executed targeting domain database servers.",
                "severity": "Medium",
                "mitre_technique": "T1021.002",
                "incident_category": "Lateral Movement",
                "create_incident": False
            },
            {
                "stage_number": 2,
                "title": "Compromised Access Delegation",
                "description": "Remote desktop authentication succeeds targeting secondary replication node using administrative hashes.",
                "severity": "High",
                "mitre_technique": "T1021.001",
                "incident_category": "Lateral Movement",
                "create_incident": True,
                "source_ip": "10.0.4.5",
                "destination_ip": "10.0.4.50",
                "remediation": "Restrict WinRM listeners to trusted subnet ranges only, reset hijacked account token credentials."
            }
        ]
    },
    "Privilege Escalation": {
        "name": "Privilege Escalation",
        "description": "Simulates security context elevation attempts targeting local system context accounts.",
        "estimated_duration": 6,
        "risk_change": 45,
        "delay_between_stages": 2,
        "difficulty": "High",
        "recommended_role": "Threat Hunter",
        "primary_mitre_techniques": ["T1134", "T1134.001"],
        "stages": [
            {
                "stage_number": 1,
                "title": "Token Escalation Query",
                "description": "Local process queries token manipulation properties of system diagnostics commands.",
                "severity": "Medium",
                "mitre_technique": "T1134",
                "incident_category": "Privilege Escalation",
                "create_incident": False
            },
            {
                "stage_number": 2,
                "title": "System Privileges Acquired",
                "description": "Standard context elevated successfully to NT AUTHORITY/SYSTEM context utilizing process injection techniques.",
                "severity": "High",
                "mitre_technique": "T1134.001",
                "incident_category": "Privilege Escalation",
                "create_incident": True,
                "source_ip": "10.0.3.15",
                "remediation": "Apply platform security patches addressing local process kernel exploits, revoke user shell context."
            }
        ]
    },
    "Ransomware Activity": {
        "name": "Ransomware Activity",
        "description": "Simulates system volume shadow copy overrides and high-speed local partition locking plays.",
        "estimated_duration": 6,
        "risk_change": 55,
        "delay_between_stages": 2,
        "difficulty": "Critical",
        "recommended_role": "SOC Analyst",
        "primary_mitre_techniques": ["T1489", "T1486"],
        "stages": [
            {
                "stage_number": 1,
                "title": "Shadow Copy Deletion",
                "description": "System command net stop 'Volume Shadow Copy' executed locally to prevent recovery actions.",
                "severity": "High",
                "mitre_technique": "T1489",
                "incident_category": "Defense Evasion",
                "create_incident": False
            },
            {
                "stage_number": 2,
                "title": "Partition Encrypt Launch",
                "description": "Bulk local drive file operations recorded renaming file extensions to custom target suffix '.locked'.",
                "severity": "Critical",
                "mitre_technique": "T1486",
                "incident_category": "Execution",
                "create_incident": True,
                "source_ip": "10.0.12.30",
                "destination_ip": "10.0.5.100",
                "remediation": "Isolate network port of infected client 10.0.12.30 immediately, restore volume data sets from backups."
            }
        ]
    }
}

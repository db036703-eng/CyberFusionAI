from app.db.models import IncidentSeverity, IncidentCategory

def map_severity_to_enum(severity: str) -> IncidentSeverity:
    """
    Translates string severity to SQLAlchemy IncidentSeverity Enum.
    """
    s = severity.strip().lower()
    if s == "critical":
        return IncidentSeverity.Critical
    elif s == "high":
        return IncidentSeverity.High
    elif s == "medium":
        return IncidentSeverity.Medium
    return IncidentSeverity.Low

def map_category_to_enum(category: str) -> IncidentCategory:
    """
    Translates string category or MITRE tactic to SQLAlchemy IncidentCategory Enum.
    """
    c = category.strip().lower()
    
    # Direct mapping attempts
    if "initial access" in c:
        return IncidentCategory.Initial_Access
    elif "execution" in c:
        return IncidentCategory.Execution
    elif "persistence" in c:
        return IncidentCategory.Persistence
    elif "privilege escalation" in c:
        return IncidentCategory.Privilege_Escalation
    elif "defense evasion" in c:
        return IncidentCategory.Defense_Evasion
    elif "credential access" in c:
        return IncidentCategory.Credential_Access
    elif "discovery" in c:
        return IncidentCategory.Discovery
    elif "lateral movement" in c:
        return IncidentCategory.Lateral_Movement
    elif "collection" in c:
        return IncidentCategory.Collection
    elif "exfiltration" in c:
        return IncidentCategory.Exfiltration
    elif "command and control" in c or "command & control" in c:
        return IncidentCategory.Command_and_Control
    elif "authentication" in c:
        return IncidentCategory.Authentication
        
    return IncidentCategory.Authentication

import urllib.request
import urllib.parse
import json

BASE_URL = "http://localhost:8000"

def api_request(path, method="GET", data=None, headers=None, form_data=False):
    url = f"{BASE_URL}{path}"
    req_headers = {
        "User-Agent": "VerificationAgent/1.0"
    }
    if headers:
        req_headers.update(headers)
        
    if data is not None:
        if form_data:
            req_data = urllib.parse.urlencode(data).encode("utf-8")
            req_headers["Content-Type"] = "application/x-www-form-urlencoded"
        else:
            req_data = json.dumps(data).encode("utf-8")
            req_headers["Content-Type"] = "application/json"
    else:
        req_data = None
        
    req = urllib.request.Request(url, data=req_data, headers=req_headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as res:
            res_data = res.read().decode("utf-8")
            return res.status, json.loads(res_data) if res_data else None
    except urllib.error.HTTPError as e:
        res_data = e.read().decode("utf-8")
        try:
            parsed_err = json.loads(res_data)
        except Exception:
            parsed_err = res_data
        return e.code, parsed_err

def run_tests():
    print("Starting programmatic integration tests for Incident Management System...")
    
    # 1. Register a test user
    print("\n1. Registering test user...")
    register_payload = {
        "username": "verification_analyst",
        "email": "verification_analyst@cyberfusion.ai",
        "password": "Password123!",
        "role": "SOC Analyst"
    }
    
    status, res = api_request("/auth/register", method="POST", data=register_payload)
    if status == 201:
        print("✓ Successfully registered test user!")
    elif status == 400 and "already exists" in str(res):
        print("✓ Test user already registered.")
    else:
        print(f"✗ Failed to register user: {status} - {res}")
        return

    # 2. Login to get JWT Token
    print("\n2. Logging in test user to obtain JWT Token...")
    login_payload = {
        "username_or_email": "verification_analyst@cyberfusion.ai",
        "password": "Password123!"
    }
    status, res = api_request("/auth/login", method="POST", data=login_payload, form_data=False)
    if status != 200:
        print(f"✗ Login failed: {status} - {res}")
        return
        
    token = res["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✓ Successfully authenticated! Token obtained.")

    # 3. Get Analysts List
    print("\n3. Fetching list of assignable analysts...")
    status, analysts = api_request("/incidents/analysts", headers=headers)
    assert status == 200
    print(f"✓ Found {len(analysts)} SOC analysts available in directory:")
    for a in analysts:
        print(f"  - User ID {a['id']}: {a['username']} ({a['role']})")

    # 4. Fetch seeded incidents with pagination
    print("\n4. Fetching seeded incidents (Page 1, Limit 5)...")
    status, data = api_request("/incidents?page=1&limit=5", headers=headers)
    assert status == 200
    print(f"✓ Total Incidents: {data['total']}, Pages: {data['pages']}, Current Page: {data['page']}")
    assert len(data["items"]) == 5
    first_incident = data["items"][0]
    print(f"  - First Incident ID: {first_incident['id']}")
    print(f"  - Title: {first_incident['title']}")
    print(f"  - Severity: {first_incident['severity']}")
    print(f"  - Status: {first_incident['status']}")

    # 5. Filter tests
    print("\n5. Testing filters...")
    # Severity Critical
    status, res = api_request("/incidents?severity=Critical", headers=headers)
    assert status == 200
    print(f"  - Critical incidents count: {res['total']}")
    for item in res["items"]:
        assert item["severity"] == "Critical"
        
    # Status Investigating
    status, res = api_request("/incidents?status=Investigating", headers=headers)
    assert status == 200
    print(f"  - Investigating incidents count: {res['total']}")
    for item in res["items"]:
        assert item["status"] == "Investigating"

    # Search filter
    status, res = api_request("/incidents?search=Bastion", headers=headers)
    assert status == 200
    print(f"  - Search match count for 'Bastion': {res['total']}")
    for item in res["items"]:
        assert "bastion" in item["title"].lower() or "bastion" in item["description"].lower()

    # 6. Create a new incident
    print("\n6. Creating a new incident record...")
    new_incident_payload = {
        "title": "Malicious DLL Execution on Domain Controller",
        "description": "System service loaded unverified DLL containing remote execution handler payload.",
        "severity": "Critical",
        "status": "New",
        "category": "Execution",
        "source_ip": "10.0.1.12",
        "destination_ip": "10.0.1.20",
        "mitre_technique": "T1574.002 (DLL Side-Loading)",
        "assigned_user_id": analysts[0]["id"] if analysts else None,
        "remediation": "Isolate the domain controller node and verify system service registry keys."
    }
    status, res = api_request("/incidents", method="POST", data=new_incident_payload, headers=headers)
    assert status == 201
    created_id = res["id"]
    print(f"✓ Created Incident successfully. Assigned ID: {created_id}")

    # 7. Read created incident
    print("\n7. Verifying incident details via GET...")
    status, created_data = api_request(f"/incidents/{created_id}", headers=headers)
    assert status == 200
    assert created_data["title"] == new_incident_payload["title"]
    assert created_data["severity"] == "Critical"
    assert created_data["status"] == "New"
    print(f"✓ Verified details: {created_data['title']} is active.")

    # 8. Update incident status and analyst assignment
    print("\n8. Updating incident status to 'Investigating' and editing remediation...")
    update_payload = {
        "status": "Investigating",
        "severity": "High",
        "assigned_user_id": analysts[1]["id"] if len(analysts) > 1 else None,
        "remediation": "Updated remediation: isolate node immediately, delete suspect dll and registry autorun entry."
    }
    status, updated_data = api_request(f"/incidents/{created_id}", method="PUT", data=update_payload, headers=headers)
    assert status == 200
    assert updated_data["status"] == "Investigating"
    assert updated_data["severity"] == "High"
    assert updated_data["remediation"] == update_payload["remediation"]
    print("✓ Successfully updated incident status, severity, and remediation playbook!")

    # 9. Verify dashboard statistics aggregation
    print("\n9. Verifying dashboard statistics aggregations...")
    status, summary = api_request("/dashboard/summary", headers=headers)
    assert status == 200
    print(f"✓ Dashboard Statistics:")
    print(f"  - Organization Risk Score: {summary['organization_risk']}")
    print(f"  - Active Critical Threats Count: {summary['critical_incidents']}")
    print(f"  - Open Anomalies Count: {summary['open_incidents']}")
    print(f"  - IoC Matches: {summary['ioc_matches']}")
    print(f"  - Threat Ingest Health: {summary['threat_feed_health']}")

    # 10. Delete the incident
    print("\n10. Deleting the created incident record...")
    status, res = api_request(f"/incidents/{created_id}", headers=headers)
    if status == 200:
        del_status, del_res = api_request(f"/incidents/{created_id}", method="DELETE", headers=headers)
        assert del_status == 204
        # Verify it's gone
        check_status, check_res = api_request(f"/incidents/{created_id}", headers=headers)
        assert check_status == 404
        print("✓ Verified deletion successful!")

    print("\n=============================================")
    print("All backend Integration tests completed successfully!")
    print("=============================================")

if __name__ == "__main__":
    run_tests()

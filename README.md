# CyberFusion AI

An enterprise-grade cybersecurity intelligence platform.

## Project Structure

```
├── .github/          # GitHub Workflows and CI/CD templates
├── backend/          # FastAPI application (Python)
├── database/         # Database migrations and configurations
├── docker/           # Shared Docker configuration files
├── docs/             # Project documentation
├── frontend/         # React, Vite, TS, Tailwind CSS frontend
├── scripts/          # Utility setup and operational scripts
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- Python (3.11+)

### Running the stack via Docker
To boot up the complete environment including frontend, backend, PostgreSQL database, and Redis:
```bash
docker compose up --build
```

### URLs
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8000](http://localhost:8000)
- Backend Health: [http://localhost:8000/health](http://localhost:8000/health)

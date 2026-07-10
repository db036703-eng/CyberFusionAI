# CyberFusion AI Database Service

This directory is reserved for database-related configurations, raw schemas, seed data, and Alembic migrations.

## Local Migrations Setup
To initialize Alembic from the backend:
```bash
cd backend
alembic init migrations
```
The migration files can be generated automatically using model metadata:
```bash
alembic revision --autogenerate -m "Initial schema"
```
And applied using:
```bash
alembic upgrade head
```

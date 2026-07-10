from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# In a modular enterprise structure, we initialize SQLAlchemy components
engine = create_engine(
    settings.get_database_url,
    pool_pre_ping=True  # Enables automatic connection checking (health check readiness)
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

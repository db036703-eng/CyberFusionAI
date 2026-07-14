import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timezone, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import Base
from app.db.models import User, RefreshToken, UserRole
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from jose import jwt
from app.core.config import settings

def test_auth():
    print("Testing backend security components...")
    
    # 1. Test Hashing
    password = "SuperSecretPassword123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_pwd", hashed) is False
    print("✓ Password hashing and verification verified successfully.")

    # 2. Test JWT Access Token
    user_id = 99
    access_token = create_access_token(subject=user_id)
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == str(user_id)
    assert payload["type"] == "access"
    print("✓ Access Token generation and decoding verified successfully.")

    # 3. Test JWT Refresh Token
    refresh_token = create_refresh_token(subject=user_id)
    payload_refresh = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload_refresh["sub"] == str(user_id)
    assert payload_refresh["type"] == "refresh"
    print("✓ Refresh Token generation and decoding verified successfully.")

    # 4. SQLite in-memory DB configuration verification
    print("Testing DB schema locally with SQLite (in-memory)...")
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    
    try:
        # Create user
        user = User(
            username="analyst_test",
            email="test@cyberfusion.ai",
            hashed_password=hashed,
            role=UserRole.SOC_ANALYST,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        assert user.id is not None
        assert user.role == UserRole.SOC_ANALYST
        print(f"✓ SQLite: User creation and role persistence verified. ID: {user.id}")

        # Create refresh token
        db_token = RefreshToken(
            token=refresh_token,
            user_id=user.id,
            expires_at=datetime.now(timezone.utc) + timedelta(days=7),
            is_revoked=False
        )
        db.add(db_token)
        db.commit()
        db.refresh(db_token)
        assert db_token.id is not None
        assert db_token.user.username == "analyst_test"
        print(f"✓ SQLite: RefreshToken relationship verified. User: {db_token.user.username}")
    finally:
        db.close()
        
    print("All security tests passed successfully!")

if __name__ == "__main__":
    test_auth()

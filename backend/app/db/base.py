# Import all the models, so that Base has them before being
# imported by Migrations or anything else.
from app.db.database import Base  # noqa
from app.db.models import User, RefreshToken, UserRole, Incident  # noqa

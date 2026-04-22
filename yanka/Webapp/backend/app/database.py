from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.pool import QueuePool
import os
from dotenv import load_dotenv
import logging

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Configure engine with better settings for RDS
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Validates connections before use
    pool_recycle=3600,   # Recycle connections after 1 hour
    echo=False,
    connect_args={
        "connect_timeout": 10,
        "application_name": "yanka_backend"
    }
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False  # Prevent session expiry issues
)

logger = logging.getLogger(__name__)

class Base(DeclarativeBase):
    pass


def get_db():
    """
    Database dependency that provides a fresh, clean session for each request.
    Ensures failed transactions don't contaminate subsequent requests.
    """
    db = SessionLocal()
    try:
        # Ensure we start with a clean transaction state
        print(f"DEBUG: get_db() - Creating fresh database session")
        db.rollback()
        print(f"DEBUG: get_db() - Initial rollback completed")
        yield db
    except Exception as e:
        print(f"DEBUG: get_db() - Database session error: {e}")
        try:
            db.rollback()
            print(f"DEBUG: get_db() - Error rollback completed")
        except Exception as rollback_error:
            print(f"DEBUG: get_db() - Error during error rollback: {rollback_error}")
        raise
    finally:
        try:
            db.close()
            print(f"DEBUG: get_db() - Closed database session")
        except Exception as e:
            print(f"DEBUG: get_db() - Error closing database session: {e}")

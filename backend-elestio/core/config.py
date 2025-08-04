"""
Configuration management for InverseNeural Trading API
Environment variables and settings
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    
    # Application
    DEBUG: bool = False
    API_SECRET_KEY: str = "your-secret-key-here"
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_DB: int = 0
    REDIS_MAX_CONNECTIONS: int = 10
    
    # Database (optional)
    DATABASE_URL: Optional[str] = None
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://inverseneural.io",
        "https://*.inverseneural.io"
    ]
    
    # Algorithm Configuration
    MAX_CONCURRENT_USERS: int = 500
    DEFAULT_POSITION_SIZE: float = 5.0
    MAX_POSITION_SIZE: float = 15.0
    MIN_POSITION_SIZE: float = 1.0
    
    # IQ Option Configuration
    IQ_OPTION_BASE_URL: str = "https://api.iqoption.com"
    IQ_OPTION_TIMEOUT: int = 30
    
    # Background Tasks
    CELERY_BROKER_URL: Optional[str] = None
    CELERY_RESULT_BACKEND: Optional[str] = None
    
    # Monitoring
    ENABLE_METRICS: bool = True
    LOG_LEVEL: str = "INFO"
    
    # Rate Limiting
    RATE_LIMIT_PER_USER: int = 100  # requests per minute
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()

# Validation
def validate_settings():
    """
    Validate critical settings on startup
    """
    errors = []
    
    if settings.API_SECRET_KEY == "your-secret-key-here":
        errors.append("API_SECRET_KEY must be set to a secure value")
    
    if len(settings.API_SECRET_KEY) < 32:
        errors.append("API_SECRET_KEY must be at least 32 characters long")
    
    if not settings.REDIS_URL:
        errors.append("REDIS_URL is required")
    
    if errors:
        raise ValueError(f"Configuration errors: {'; '.join(errors)}")
    
    return True

"""
InverseNeural Lab - FastAPI Backend for Elestio
Trading Algorithm API Server
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import redis.asyncio as redis
import os
import logging
from typing import Optional
import asyncio

# Import our modules
from routers import algorithm, health, users
from core.redis_client import get_redis_client
from core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager
    """
    # Startup
    logger.info("🚀 Starting InverseNeural Trading API...")
    
    # Initialize Redis connection
    try:
        redis_client = await get_redis_client()
        await redis_client.ping()
        logger.info("✅ Redis connection established")
    except Exception as e:
        logger.error(f"❌ Redis connection failed: {e}")
    
    # Test algorithm imports
    try:
        from core.strategy import TradingStrategy
        logger.info("✅ Trading strategy modules loaded")
    except Exception as e:
        logger.error(f"❌ Strategy modules failed to load: {e}")
    
    yield
    
    # Shutdown
    logger.info("🔄 Shutting down InverseNeural Trading API...")

# Create FastAPI app
app = FastAPI(
    title="InverseNeural Trading API",
    description="Advanced Quantitative Trading Algorithm API",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Auth dependency
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify API token from frontend
    """
    if credentials.credentials != settings.API_SECRET_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )
    return credentials.credentials

# Include routers
app.include_router(
    health.router,
    prefix="/health",
    tags=["health"]
)

app.include_router(
    algorithm.router,
    prefix="/algorithm",
    tags=["algorithm"],
    dependencies=[Depends(verify_token)]
)

app.include_router(
    users.router,
    prefix="/user",
    tags=["users"],
    dependencies=[Depends(verify_token)]
)

# Root endpoint
@app.get("/")
async def root():
    """
    API Root - Basic info
    """
    return {
        "service": "InverseNeural Trading API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs" if settings.DEBUG else "disabled"
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for unhandled errors
    """
    logger.error(f"Unhandled exception: {exc}")
    return {
        "error": "Internal server error",
        "message": str(exc) if settings.DEBUG else "An error occurred"
    }

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )

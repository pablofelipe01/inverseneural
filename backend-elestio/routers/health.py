"""
Health check router for InverseNeural Trading API
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
import asyncio
import psutil
import logging
from core.redis_client import get_redis_client
from core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def health_check():
    """
    Basic health check endpoint
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "InverseNeural Trading API",
        "version": "1.0.0"
    }

@router.get("/detailed")
async def detailed_health_check():
    """
    Detailed health check with system metrics
    """
    health_data = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "InverseNeural Trading API",
        "version": "1.0.0",
        "checks": {}
    }
    
    # Redis connectivity check
    try:
        redis_client = await get_redis_client()
        await redis_client.redis.ping()
        health_data["checks"]["redis"] = {
            "status": "healthy",
            "url": settings.REDIS_URL
        }
    except Exception as e:
        health_data["checks"]["redis"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_data["status"] = "degraded"
    
    # System metrics
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        health_data["checks"]["system"] = {
            "status": "healthy",
            "cpu_percent": cpu_percent,
            "memory_percent": memory.percent,
            "memory_available_gb": round(memory.available / (1024**3), 2),
            "disk_percent": disk.percent,
            "disk_free_gb": round(disk.free / (1024**3), 2)
        }
        
        # Set unhealthy if resources are critically low
        if cpu_percent > 90 or memory.percent > 90 or disk.percent > 90:
            health_data["checks"]["system"]["status"] = "critical"
            health_data["status"] = "unhealthy"
            
    except Exception as e:
        health_data["checks"]["system"] = {
            "status": "unhealthy",
            "error": str(e)
        }
    
    # Active users check
    try:
        redis_client = await get_redis_client()
        active_users = await redis_client.get_active_users()
        
        health_data["checks"]["users"] = {
            "status": "healthy",
            "active_users_count": len(active_users),
            "max_concurrent_users": settings.MAX_CONCURRENT_USERS
        }
        
        # Warning if approaching limit
        if len(active_users) > settings.MAX_CONCURRENT_USERS * 0.8:
            health_data["checks"]["users"]["status"] = "warning"
            health_data["status"] = "degraded"
            
    except Exception as e:
        health_data["checks"]["users"] = {
            "status": "unhealthy",
            "error": str(e)
        }
    
    return health_data

@router.get("/readiness")
async def readiness_check():
    """
    Kubernetes readiness probe endpoint
    """
    try:
        # Check Redis
        redis_client = await get_redis_client()
        await redis_client.redis.ping()
        
        # Check if we can handle more users
        active_users = await redis_client.get_active_users()
        if len(active_users) >= settings.MAX_CONCURRENT_USERS:
            raise HTTPException(
                status_code=503,
                detail="Service at capacity"
            )
        
        return {"status": "ready"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service not ready: {str(e)}"
        )

@router.get("/liveness")
async def liveness_check():
    """
    Kubernetes liveness probe endpoint
    """
    return {"status": "alive", "timestamp": datetime.utcnow().isoformat()}

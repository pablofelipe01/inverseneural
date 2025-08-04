"""
User management router for InverseNeural Trading API
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import logging

from core.redis_client import get_redis_client

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/status/{user_id}")
async def get_user_status(user_id: str):
    """
    Get user's algorithm status and basic info
    """
    try:
        redis_client = await get_redis_client()
        status = await redis_client.get_user_status(user_id)
        
        return {
            "user_id": user_id,
            "has_active_algorithm": status is not None,
            "algorithm_status": status.get("status") if status else "stopped",
            "last_update": status.get("last_update") if status else None
        }
        
    except Exception as e:
        logger.error(f"Error getting user status for {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get user status: {str(e)}"
        )

@router.post("/config/{user_id}")
async def update_user_config(user_id: str, config: dict):
    """
    Update user configuration
    """
    try:
        redis_client = await get_redis_client()
        
        # Get current status
        current_status = await redis_client.get_user_status(user_id)
        if current_status:
            current_status["config"] = config
            await redis_client.set_user_status(user_id, current_status)
        
        return {
            "success": True,
            "message": "Configuration updated successfully"
        }
        
    except Exception as e:
        logger.error(f"Error updating config for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update configuration: {str(e)}"
        )

@router.get("/active")
async def get_active_users():
    """
    Get list of users with active algorithms (admin endpoint)
    """
    try:
        redis_client = await get_redis_client()
        active_users = await redis_client.get_active_users()
        
        return {
            "active_users": active_users,
            "count": len(active_users)
        }
        
    except Exception as e:
        logger.error(f"Error getting active users: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get active users: {str(e)}"
        )

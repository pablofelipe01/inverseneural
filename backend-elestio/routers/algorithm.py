"""
Algorithm management router for InverseNeural Trading API
Handles trading algorithm lifecycle
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import logging
import asyncio

from core.redis_client import get_redis_client
from core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# Request/Response Models
class AlgorithmConfig(BaseModel):
    selectedPairs: List[str] = Field(..., description="Selected trading pairs")
    selectedCrypto: List[str] = Field(..., description="Selected crypto assets")
    positionSize: float = Field(..., ge=1.0, le=15.0, description="Position size percentage")
    pairsPositionSize: float = Field(..., ge=1.0, le=15.0, description="Pairs position size")
    cryptoPositionSize: float = Field(..., ge=1.0, le=10.0, description="Crypto position size")
    aggressiveness: str = Field(..., description="Algorithm aggressiveness level")
    email: str = Field(..., description="IQ Option email")
    password: str = Field(..., description="IQ Option password")
    accountType: str = Field(..., description="Account type (PRACTICE/REAL)")

class AlgorithmStatus(BaseModel):
    user_id: str
    status: str
    profit: float
    trades: int
    win_rate: float
    start_time: Optional[str] = None
    last_update: str

class LogEntry(BaseModel):
    timestamp: str
    level: str
    message: str

@router.post("/start")
async def start_algorithm(
    config: AlgorithmConfig,
    background_tasks: BackgroundTasks,
    user_id: str = Query(..., description="User ID")
):
    """
    Start trading algorithm for a user
    """
    try:
        redis_client = await get_redis_client()
        
        # Check if user already has running algorithm
        current_status = await redis_client.get_user_status(user_id)
        if current_status and current_status.get("status") == "running":
            raise HTTPException(
                status_code=400,
                detail="Algorithm is already running for this user"
            )
        
        # Check concurrent user limit
        active_users = await redis_client.get_active_users()
        if len(active_users) >= settings.MAX_CONCURRENT_USERS:
            raise HTTPException(
                status_code=503,
                detail="Service at capacity. Please try again later."
            )
        
        # Validate configuration
        total_assets = len(config.selectedPairs) + len(config.selectedCrypto)
        if total_assets == 0:
            raise HTTPException(
                status_code=400,
                detail="At least one trading pair or crypto asset must be selected"
            )
        
        # Initialize algorithm status
        algorithm_status = {
            "user_id": user_id,
            "status": "running",
            "profit": 0.0,
            "trades": 0,
            "win_rate": 0.0,
            "start_time": datetime.utcnow().isoformat(),
            "last_update": datetime.utcnow().isoformat(),
            "config": config.dict()
        }
        
        # Save status to Redis
        await redis_client.set_user_status(user_id, algorithm_status)
        
        # Add log entry
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": "success",
            "message": f"🚀 Algorithm started with {total_assets} assets"
        }
        await redis_client.add_log_entry(user_id, log_entry)
        
        # Queue background task to start actual algorithm
        background_tasks.add_task(run_trading_algorithm, user_id, config.dict())
        
        return {
            "success": True,
            "message": "Algorithm started successfully",
            "status": algorithm_status
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting algorithm for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start algorithm: {str(e)}"
        )

@router.get("/stop")
async def stop_algorithm(user_id: str = Query(..., description="User ID")):
    """
    Stop trading algorithm for a user
    """
    try:
        redis_client = await get_redis_client()
        
        # Get current status
        current_status = await redis_client.get_user_status(user_id)
        if not current_status:
            raise HTTPException(
                status_code=404,
                detail="No algorithm found for this user"
            )
        
        if current_status.get("status") != "running":
            raise HTTPException(
                status_code=400,
                detail="Algorithm is not currently running"
            )
        
        # Update status to stopped
        current_status["status"] = "stopped"
        current_status["last_update"] = datetime.utcnow().isoformat()
        
        await redis_client.set_user_status(user_id, current_status)
        
        # Add log entry
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": "info",
            "message": "⏹️ Algorithm stopped by user"
        }
        await redis_client.add_log_entry(user_id, log_entry)
        
        return {
            "success": True,
            "message": "Algorithm stopped successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error stopping algorithm for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to stop algorithm: {str(e)}"
        )

@router.get("/status/{user_id}")
async def get_algorithm_status(user_id: str) -> AlgorithmStatus:
    """
    Get algorithm status for a user
    """
    try:
        redis_client = await get_redis_client()
        status = await redis_client.get_user_status(user_id)
        
        if not status:
            # Return default status if not found
            return AlgorithmStatus(
                user_id=user_id,
                status="stopped",
                profit=0.0,
                trades=0,
                win_rate=0.0,
                last_update=datetime.utcnow().isoformat()
            )
        
        return AlgorithmStatus(**status)
        
    except Exception as e:
        logger.error(f"Error getting status for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get algorithm status: {str(e)}"
        )

@router.get("/reset/{user_id}")
async def reset_algorithm(user_id: str):
    """
    Reset algorithm statistics for a user
    """
    try:
        redis_client = await get_redis_client()
        
        # Get current status
        current_status = await redis_client.get_user_status(user_id)
        if not current_status:
            raise HTTPException(
                status_code=404,
                detail="No algorithm found for this user"
            )
        
        if current_status.get("status") == "running":
            raise HTTPException(
                status_code=400,
                detail="Cannot reset while algorithm is running. Stop it first."
            )
        
        # Reset statistics
        current_status.update({
            "profit": 0.0,
            "trades": 0,
            "win_rate": 0.0,
            "last_update": datetime.utcnow().isoformat()
        })
        
        await redis_client.set_user_status(user_id, current_status)
        
        # Add log entry
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": "success",
            "message": "✅ Algorithm statistics reset successfully"
        }
        await redis_client.add_log_entry(user_id, log_entry)
        
        return {
            "success": True,
            "message": "Algorithm statistics reset successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resetting algorithm for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reset algorithm: {str(e)}"
        )

@router.get("/logs/{user_id}")
async def get_algorithm_logs(
    user_id: str,
    limit: int = Query(100, ge=1, le=1000, description="Number of logs to retrieve")
):
    """
    Get algorithm logs for a user
    """
    try:
        redis_client = await get_redis_client()
        logs = await redis_client.get_user_logs(user_id, limit)
        
        return {
            "success": True,
            "logs": logs,
            "count": len(logs)
        }
        
    except Exception as e:
        logger.error(f"Error getting logs for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get algorithm logs: {str(e)}"
        )

# Background task to run the actual trading algorithm
async def run_trading_algorithm(user_id: str, config: dict):
    """
    Background task that runs the actual trading algorithm
    This is where the magic happens!
    """
    redis_client = await get_redis_client()
    
    try:
        # Import trading strategy (this will be moved from your current backend)
        # from core.strategy import TradingStrategy
        
        # For now, simulate algorithm execution
        await simulate_trading_algorithm(user_id, config, redis_client)
        
    except Exception as e:
        logger.error(f"Trading algorithm error for user {user_id}: {e}")
        
        # Update status to error
        error_status = await redis_client.get_user_status(user_id)
        if error_status:
            error_status["status"] = "error"
            error_status["last_update"] = datetime.utcnow().isoformat()
            await redis_client.set_user_status(user_id, error_status)
        
        # Add error log
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": "error",
            "message": f"❌ Algorithm error: {str(e)}"
        }
        await redis_client.add_log_entry(user_id, log_entry)

async def simulate_trading_algorithm(user_id: str, config: dict, redis_client):
    """
    Simulate trading algorithm execution
    Replace this with actual trading logic
    """
    import random
    
    profit = 0.0
    trades = 0
    wins = 0
    
    while True:
        # Check if algorithm should continue running
        status = await redis_client.get_user_status(user_id)
        if not status or status.get("status") != "running":
            break
        
        # Simulate a trade every 30 seconds
        await asyncio.sleep(30)
        
        # Simulate trade outcome
        trade_profit = random.uniform(-10, 15)  # Random profit between -10 and 15
        profit += trade_profit
        trades += 1
        
        if trade_profit > 0:
            wins += 1
        
        win_rate = (wins / trades * 100) if trades > 0 else 0
        
        # Update status
        updated_status = await redis_client.get_user_status(user_id)
        if updated_status:
            updated_status.update({
                "profit": round(profit, 2),
                "trades": trades,
                "win_rate": round(win_rate, 1),
                "last_update": datetime.utcnow().isoformat()
            })
            await redis_client.set_user_status(user_id, updated_status)
        
        # Add log entry for successful trade
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": "success" if trade_profit > 0 else "warning",
            "message": f"📈 Trade completed: ${trade_profit:.2f} | Total: ${profit:.2f}"
        }
        await redis_client.add_log_entry(user_id, log_entry)

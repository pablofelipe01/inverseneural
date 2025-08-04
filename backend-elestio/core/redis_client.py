"""
Redis client for InverseNeural Trading API
Handles connections, queues, and caching
"""

import redis.asyncio as redis
from typing import Optional
import json
import logging
from .config import settings

logger = logging.getLogger(__name__)

class RedisClient:
    """
    Async Redis client with connection pooling
    """
    
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
        self.connection_pool: Optional[redis.ConnectionPool] = None
    
    async def connect(self):
        """
        Initialize Redis connection
        """
        try:
            self.connection_pool = redis.ConnectionPool.from_url(
                settings.REDIS_URL,
                max_connections=settings.REDIS_MAX_CONNECTIONS,
                encoding="utf-8",
                decode_responses=True
            )
            
            self.redis = redis.Redis(connection_pool=self.connection_pool)
            
            # Test connection
            await self.redis.ping()
            logger.info("✅ Redis connection established")
            
        except Exception as e:
            logger.error(f"❌ Redis connection failed: {e}")
            raise
    
    async def disconnect(self):
        """
        Close Redis connection
        """
        if self.redis:
            await self.redis.close()
        if self.connection_pool:
            await self.connection_pool.disconnect()
    
    async def get_user_status(self, user_id: str) -> Optional[dict]:
        """
        Get user algorithm status from Redis
        """
        try:
            data = await self.redis.get(f"user:{user_id}:status")
            return json.loads(data) if data else None
        except Exception as e:
            logger.error(f"Error getting user status: {e}")
            return None
    
    async def set_user_status(self, user_id: str, status: dict, expire: int = 3600):
        """
        Set user algorithm status in Redis
        """
        try:
            await self.redis.setex(
                f"user:{user_id}:status",
                expire,
                json.dumps(status)
            )
        except Exception as e:
            logger.error(f"Error setting user status: {e}")
    
    async def add_log_entry(self, user_id: str, log_entry: dict):
        """
        Add log entry to user's log list
        """
        try:
            await self.redis.lpush(
                f"user:{user_id}:logs",
                json.dumps(log_entry)
            )
            # Keep only last 1000 log entries
            await self.redis.ltrim(f"user:{user_id}:logs", 0, 999)
        except Exception as e:
            logger.error(f"Error adding log entry: {e}")
    
    async def get_user_logs(self, user_id: str, limit: int = 100) -> list:
        """
        Get user logs from Redis
        """
        try:
            logs = await self.redis.lrange(f"user:{user_id}:logs", 0, limit - 1)
            return [json.loads(log) for log in logs]
        except Exception as e:
            logger.error(f"Error getting user logs: {e}")
            return []
    
    async def queue_task(self, queue_name: str, task_data: dict):
        """
        Add task to Redis queue
        """
        try:
            await self.redis.lpush(
                f"queue:{queue_name}",
                json.dumps(task_data)
            )
        except Exception as e:
            logger.error(f"Error queuing task: {e}")
    
    async def get_active_users(self) -> list:
        """
        Get list of users with active algorithms
        """
        try:
            keys = await self.redis.keys("user:*:status")
            user_ids = [key.split(":")[1] for key in keys]
            return user_ids
        except Exception as e:
            logger.error(f"Error getting active users: {e}")
            return []

# Global Redis client instance
redis_client = RedisClient()

async def get_redis_client() -> RedisClient:
    """
    Dependency to get Redis client
    """
    if not redis_client.redis:
        await redis_client.connect()
    return redis_client

"""
MongoDB Database Connection Manager

This module handles MongoDB connections with connection pooling,
error handling, and automatic retry logic.
"""
import os
import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import asyncio

logger = logging.getLogger(__name__)


class DatabaseManager:
    """
    Manages MongoDB connections with connection pooling and error handling.
    
    Implements singleton pattern to ensure only one connection pool exists.
    """
    
    _instance: Optional['DatabaseManager'] = None
    _client: Optional[AsyncIOMotorClient] = None
    _database: Optional[AsyncIOMotorDatabase] = None
    
    def __new__(cls):
        """Singleton pattern implementation"""
        if cls._instance is None:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize database manager"""
        self.max_retries = 3
        self.retry_delay = 1  # seconds
    
    @property
    def mongodb_uri(self) -> Optional[str]:
        """Get MongoDB URI from environment"""
        return os.getenv("MONGODB_URI")
    
    @property
    def db_name(self) -> str:
        """Get database name from environment"""
        return os.getenv("MONGODB_DB_NAME", "insightsphere")
        
    async def connect(self) -> None:
        """
        Establish connection to MongoDB with retry logic.
        
        Raises:
            ConnectionFailure: If unable to connect after max retries
        """
        if self._client is not None:
            logger.info("Database already connected")
            return
        
        if not self.mongodb_uri:
            raise ValueError("MONGODB_URI environment variable not set")
        
        for attempt in range(1, self.max_retries + 1):
            try:
                logger.info(f"Attempting to connect to MongoDB (attempt {attempt}/{self.max_retries})...")
                
                # Create MongoDB client with connection pooling
                self._client = AsyncIOMotorClient(
                    self.mongodb_uri,
                    maxPoolSize=50,  # Maximum number of connections in the pool
                    minPoolSize=10,  # Minimum number of connections in the pool
                    serverSelectionTimeoutMS=5000,  # 5 second timeout
                    connectTimeoutMS=10000,  # 10 second connection timeout
                    socketTimeoutMS=30000,  # 30 second socket timeout
                )
                
                # Test the connection
                await self._client.admin.command('ping')
                
                # Get database reference
                self._database = self._client[self.db_name]
                
                logger.info(f"✅ Successfully connected to MongoDB database: {self.db_name}")
                return
                
            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                logger.error(f"❌ Connection attempt {attempt} failed: {str(e)}")
                
                if attempt < self.max_retries:
                    logger.info(f"Retrying in {self.retry_delay} seconds...")
                    await asyncio.sleep(self.retry_delay)
                else:
                    logger.error("Max retries reached. Unable to connect to MongoDB.")
                    raise ConnectionFailure(
                        f"Failed to connect to MongoDB after {self.max_retries} attempts"
                    )
            
            except Exception as e:
                logger.error(f"Unexpected error during connection: {str(e)}")
                raise
    
    async def disconnect(self) -> None:
        """
        Close MongoDB connection gracefully.
        """
        if self._client is not None:
            logger.info("Closing MongoDB connection...")
            self._client.close()
            self._client = None
            self._database = None
            logger.info("✅ MongoDB connection closed")
        else:
            logger.info("No active MongoDB connection to close")
    
    def get_database(self) -> AsyncIOMotorDatabase:
        """
        Get the database instance.
        
        Returns:
            AsyncIOMotorDatabase: The database instance
            
        Raises:
            RuntimeError: If database is not connected
        """
        if self._database is None:
            raise RuntimeError(
                "Database not connected. Call connect() first."
            )
        return self._database
    
    def get_collection(self, collection_name: str):
        """
        Get a collection from the database.
        
        Args:
            collection_name: Name of the collection
            
        Returns:
            AsyncIOMotorCollection: The collection instance
            
        Raises:
            RuntimeError: If database is not connected
        """
        database = self.get_database()
        return database[collection_name]
    
    async def create_indexes(self) -> None:
        """
        Create database indexes for optimal performance.
        
        This should be called after connecting to ensure all indexes exist.
        """
        try:
            logger.info("Creating database indexes...")
            
            database = self.get_database()
            
            # Users collection indexes
            users_collection = database["users"]
            await users_collection.create_index("email", unique=True)
            await users_collection.create_index("created_at")
            logger.info("✅ Created indexes for 'users' collection")
            
            # Mood logs collection indexes
            mood_logs_collection = database["mood_logs"]
            await mood_logs_collection.create_index([("user_id", 1), ("date", -1)])
            await mood_logs_collection.create_index("created_at")
            logger.info("✅ Created indexes for 'mood_logs' collection")
            
            # Wellness plans collection indexes
            wellness_plans_collection = database["wellness_plans"]
            await wellness_plans_collection.create_index([("user_id", 1), ("created_at", -1)])
            logger.info("✅ Created indexes for 'wellness_plans' collection")
            
            # Chat conversations collection indexes
            chat_conversations_collection = database["chat_conversations"]
            await chat_conversations_collection.create_index([("user_id", 1), ("updated_at", -1)])
            await chat_conversations_collection.create_index("created_at")
            logger.info("✅ Created indexes for 'chat_conversations' collection")
            
            logger.info("✅ All database indexes created successfully")
            
        except Exception as e:
            logger.error(f"Error creating indexes: {str(e)}")
            # Don't raise - indexes are important but not critical for startup
    
    @property
    def is_connected(self) -> bool:
        """Check if database is connected"""
        return self._client is not None and self._database is not None


# Global database manager instance
db_manager = DatabaseManager()


async def get_database() -> AsyncIOMotorDatabase:
    """
    Dependency function to get database instance.
    
    This can be used with FastAPI's dependency injection.
    
    Returns:
        AsyncIOMotorDatabase: The database instance
    """
    return db_manager.get_database()


async def init_database() -> None:
    """
    Initialize database connection and create indexes.
    
    This should be called during application startup.
    """
    await db_manager.connect()
    await db_manager.create_indexes()


async def close_database() -> None:
    """
    Close database connection.
    
    This should be called during application shutdown.
    """
    await db_manager.disconnect()

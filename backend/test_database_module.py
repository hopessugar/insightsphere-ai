"""
Test script for database connection module
"""
import asyncio
import logging
from dotenv import load_dotenv
from database import init_database, close_database, db_manager

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

async def test_database_connection():
    """Test database connection module"""
    print("=" * 60)
    print("🧪 Testing Database Connection Module")
    print("=" * 60)
    
    try:
        # Test initialization
        print("\n1️⃣ Testing database initialization...")
        await init_database()
        
        # Test database access
        print("\n2️⃣ Testing database access...")
        database = db_manager.get_database()
        print(f"✅ Database name: {database.name}")
        
        # Test collection access
        print("\n3️⃣ Testing collection access...")
        users_collection = db_manager.get_collection("users")
        print(f"✅ Users collection: {users_collection.name}")
        
        # Test connection status
        print("\n4️⃣ Testing connection status...")
        print(f"✅ Is connected: {db_manager.is_connected}")
        
        # Test a simple query
        print("\n5️⃣ Testing database query...")
        count = await users_collection.count_documents({})
        print(f"✅ Current user count: {count}")
        
        # Test closing connection
        print("\n6️⃣ Testing connection close...")
        await close_database()
        print(f"✅ Connection closed. Is connected: {db_manager.is_connected}")
        
        print("\n" + "=" * 60)
        print("✅ All database module tests passed!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_database_connection())

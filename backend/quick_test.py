import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'http://localhost:8000/api/auth/register',
            json={
                'email': 'testapi@example.com',
                'name': 'API Test',
                'password': 'TestPass123'
            }
        )
        print(f'Status: {response.status_code}')
        print(f'Response: {response.json()}')

asyncio.run(test())

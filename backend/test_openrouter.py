import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

async def test():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": "Say hello"
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload
        )

    print(response.status_code)
    print(response.text)

asyncio.run(test())
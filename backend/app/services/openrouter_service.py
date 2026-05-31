import os
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)


async def ask_ai(prompt):

    headers = {
        "Authorization":
        f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type":
        "application/json"
    }

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.3
    }

    async with httpx.AsyncClient() as client:

        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload
        )

    data = response.json()

    return data["choices"][0]["message"]["content"]


async def ask_document_ai(
    document_text,
    question
):

    prompt = f"""
You are an intelligent document assistant.

Answer ONLY using the document.

DOCUMENT:
{document_text}

QUESTION:
{question}

If answer exists in document:
give exact answer.

If answer is partially available:
summarize it.

If answer does not exist:
say:
'The document does not contain this information.'
"""

    return await ask_ai(prompt)
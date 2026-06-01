import os
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


async def ask_ai(prompt):

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.3,
        "max_tokens": 1000
    }

    try:

        async with httpx.AsyncClient(timeout=60) as client:

            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload
            )

        response.raise_for_status()

        data = response.json()

        return data["choices"][0]["message"]["content"]

    except Exception as e:

        print("OPENROUTER ERROR:", str(e))

        return "Error connecting to AI server."


async def ask_document_ai(
    document_text,
    question
):

    # If no document uploaded -> behave like ChatGPT
    if not document_text.strip():

        return await ask_ai(question)

    prompt = f"""
You are SmartFAQ AI.

RULES:

1. If the user is greeting
   (Hi, Hello, Hey, Good Morning, etc.)
   reply naturally.

2. If the user asks a general question
   unrelated to the document,
   answer normally like ChatGPT.

3. If the question is related to the document,
   use the document content.

4. If the answer is not found in the document,
   you may answer using your general knowledge.

DOCUMENT:

{document_text}

USER QUESTION:

{question}
"""

    return await ask_ai(prompt)
# ==========================================
# GENERAL CHAT MODE
# ==========================================

async def ask_general_ai(question):

    return await ask_ai(question)
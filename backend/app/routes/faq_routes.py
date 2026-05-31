from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form
)

import shutil
import os

from app.services.file_reader import read_file
from app.services.openrouter_service import ask_ai

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

@router.post("/chat")
async def chat(
    message: str = Form(...),
    document_text: str = Form(""),
    file: UploadFile = File(None)
):

    file_name = "General Chat"

    try:

        if file:

            file_path = (
                f"{UPLOAD_FOLDER}/"
                f"{file.filename}"
            )

            with open(
                file_path,
                "wb"
            ) as buffer:

                shutil.copyfileobj(
                    file.file,
                    buffer
                )

            document_text = read_file(
                file_path
            )

            file_name = file.filename

        response = ask_ai(
            document_text,
            message
        )

        return {
            "response": response,
            "file_name": file_name,
            "document_text": document_text
        }

    except Exception as e:

        return {
            "response": str(e),
            "file_name": file_name,
            "document_text": document_text
        }
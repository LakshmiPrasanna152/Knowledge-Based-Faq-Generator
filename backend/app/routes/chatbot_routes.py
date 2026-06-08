from fastapi import APIRouter, UploadFile, File, Form
from app.services.openrouter_service import ask_document_ai, ask_general_ai
from app.services.file_reader import read_file_bytes

router = APIRouter()


@router.post("/chat")
async def chat(
    message: str = Form(""),
    document_text: str = Form(""),
    file: UploadFile = File(None),
):
    combined_text = document_text
    file_name = None

    if file:
        file_name = file.filename
        contents = await file.read()
        extracted = read_file_bytes(contents, file.filename)
        combined_text += "\n" + extracted

    if not combined_text.strip():
        response = await ask_general_ai(message)
        return {"response": response, "document_text": "", "file_name": file_name}

    response = await ask_document_ai(combined_text, message)
    return {"response": response, "document_text": combined_text, "file_name": file_name}
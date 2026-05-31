from fastapi import APIRouter, UploadFile, File

from app.services.openrouter_service import ask_ai

import os
import PyPDF2
import docx

router = APIRouter()

UPLOAD_DIR = "app/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/document")

async def upload_document(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = ""

    if file.filename.endswith(".pdf"):

        with open(file_path, "rb") as pdf_file:

            reader = PyPDF2.PdfReader(pdf_file)

            for page in reader.pages:
                text += page.extract_text()

    elif file.filename.endswith(".docx"):

        doc = docx.Document(file_path)

        for para in doc.paragraphs:
            text += para.text

    else:

        with open(file_path, "r", encoding="utf-8") as txt:
            text = txt.read()

    prompt = f"Generate professional FAQs from this business document:\n{text}"

    faq = await ask_ai(prompt)

    return {
        "faq": faq
    }
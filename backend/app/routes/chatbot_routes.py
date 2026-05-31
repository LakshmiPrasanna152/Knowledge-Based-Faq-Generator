from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form
)

import io
import PyMuPDF  # type: ignore[import]
import fitz  # type: ignore[import]
from docx import Document

from app.services.openrouter_service import (
    ask_document_ai
)

router = APIRouter()


# ==========================================
# EXTRACT TEXT FROM FILES
# ==========================================

def extract_text(file_bytes, filename):

    filename = filename.lower()

    try:

        # TXT / MD
        if filename.endswith(".txt") or filename.endswith(".md"):

            return file_bytes.decode(
                "utf-8",
                errors="ignore"
            )

        # PDF
        elif filename.endswith(".pdf"):

            pdf = fitz.open(
                stream=file_bytes,
                filetype="pdf"
            )

            text = ""

            for page in pdf:
                text += page.get_text()

            pdf.close()

            return text

        # DOCX
        elif filename.endswith(".docx"):

            doc = Document(
                io.BytesIO(file_bytes)
            )

            text = "\n".join(
                para.text
                for para in doc.paragraphs
            )

            return text

        else:

            return "Unsupported file format."

    except Exception as e:

        return f"File Read Error: {str(e)}"


# ==========================================
# CHAT API
# ==========================================

@router.post("/chat")
async def chat(
    message: str = Form(""),
    document_text: str = Form(""),
    file: UploadFile = File(None),
):

    combined_text = document_text
    file_name = None

    # FILE UPLOAD
    if file:

        file_name = file.filename

        contents = await file.read()

        extracted_text = extract_text(
            contents,
            file.filename
        )

        combined_text += "\n" + extracted_text

    # NO DOCUMENT
    if not combined_text.strip():

        return {
            "response":
            "Please upload a document first.",
            "document_text": "",
            "file_name": file_name,
        }

    print("QUESTION:", message)
    print("DOC LENGTH:", len(combined_text))

    # AI ANALYSIS
    response = await ask_document_ai(
        combined_text,
        message
    )

    return {
        "response": response,
        "document_text": combined_text,
        "file_name": file_name,
    }
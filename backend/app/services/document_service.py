from PyPDF2 import PdfReader
from docx import Document


def extract_pdf_text(file_path):
    text = ""

    reader = PdfReader(file_path)

    for page in reader.pages:
        text += page.extract_text()

    return text


def extract_docx_text(file_path):
    doc = Document(file_path)

    text = ""

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text
import os
from PyPDF2 import PdfReader
from docx import Document

def read_file(file_path):

    ext = os.path.splitext(
        file_path
    )[1].lower()

    try:

        if ext == ".txt" or ext == ".md":

            with open(
                file_path,
                "r",
                encoding="utf-8"
            ) as f:

                return f.read()

        elif ext == ".pdf":

            text = ""

            reader = PdfReader(file_path)

            for page in reader.pages:

                extracted = page.extract_text()

                if extracted:

                    text += extracted + "\n"

            return text

        elif ext == ".docx":

            doc = Document(file_path)

            return "\n".join(
                [
                    para.text
                    for para in doc.paragraphs
                ]
            )

        else:

            return "Unsupported file format"

    except Exception as e:

        return f"File Read Error: {str(e)}"
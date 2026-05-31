from .openrouter_service import ask_ai


def generate_faq(document_text):
    prompt = f"""
    Generate professional FAQ questions and answers from the following business document.

    Return:
    Question:
    Answer:

    Document:
    {document_text}
    """

    response = ask_ai(prompt)

    return response
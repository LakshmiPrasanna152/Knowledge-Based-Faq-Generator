from fastapi import APIRouter, UploadFile, File, Form
import shutil, os, json
from app.services.file_reader import read_file
from app.services.openrouter_service import ask_ai

router = APIRouter()
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ══════════════════════════════════════════════
# GENERATE FAQ  →  POST /generate-faq
# ══════════════════════════════════════════════
@router.post("/generate-faq")
async def generate_faq(
    file: UploadFile = File(...),
    num_faqs: int = Form(10)
):
    try:
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        document_text = read_file(file_path)

        prompt = f"""You are an expert FAQ generator for business documents.

Read the following document carefully and generate exactly {num_faqs} high-quality FAQ entries.

RULES:
1. Each FAQ must be directly relevant to the document content.
2. Questions should be realistic questions a customer or employee might ask.
3. Answers must be accurate, clear, and based on the document.
4. Return ONLY valid JSON — no markdown fences, no extra text.

DOCUMENT:
{document_text[:6000]}

Return JSON in this exact format:
{{
  "faqs": [
    {{"question": "...", "answer": "..."}},
    {{"question": "...", "answer": "..."}}
  ]
}}"""

        raw = await ask_ai(prompt)

        # parse JSON from response
        try:
            # strip any markdown fences if present
            clean = raw.strip().replace("```json", "").replace("```", "").strip()
            data = json.loads(clean)
            faqs = data.get("faqs", [])
        except Exception:
            # fallback: return raw as single FAQ
            faqs = [{"question": "Generated Content", "answer": raw}]

        return {"faqs": faqs, "file_name": file.filename, "count": len(faqs)}

    except Exception as e:
        return {"faqs": [], "error": str(e)}


# ══════════════════════════════════════════════
# SUMMARIZE  →  POST /summarize
# ══════════════════════════════════════════════
@router.post("/summarize")
async def summarize(
    file: UploadFile = File(...)
):
    try:
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        document_text = read_file(file_path)
        word_count = len(document_text.split())

        prompt = f"""You are an expert business document analyst.

Summarize the following document in a clear, structured way:
- Start with a 2-3 sentence executive summary.
- List 4-6 key points as bullet points (use • symbol).
- End with one sentence about the document's purpose.

Keep the total summary under 300 words.

DOCUMENT:
{document_text[:5000]}"""

        summary = await ask_ai(prompt)

        return {
            "summary": summary,
            "file_name": file.filename,
            "word_count": word_count
        }

    except Exception as e:
        return {"summary": f"Error: {str(e)}", "file_name": file.filename if file else "unknown"}


# ══════════════════════════════════════════════
# COMPARE DOCS  →  POST /compare-docs
# ══════════════════════════════════════════════
@router.post("/compare-docs")
async def compare_docs(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
):
    try:
        path1 = f"{UPLOAD_FOLDER}/{file1.filename}"
        path2 = f"{UPLOAD_FOLDER}/{file2.filename}"
        with open(path1, "wb") as b: shutil.copyfileobj(file1.file, b)
        with open(path2, "wb") as b: shutil.copyfileobj(file2.file, b)

        text1 = read_file(path1)
        text2 = read_file(path2)

        prompt = f"""You are a professional document analyst.

Compare these two documents. Return ONLY a valid JSON object with these EXACT keys (all values must be plain strings, not nested objects):
- "similarities": a plain text paragraph describing common topics shared by both documents
- "unique_doc1": a plain text paragraph describing content only in Document 1
- "unique_doc2": a plain text paragraph describing content only in Document 2
- "summary": a 2-3 sentence overall comparison summary

IMPORTANT: Every value must be a plain string. Do NOT nest objects inside the values.
Return ONLY JSON, no markdown fences, no extra text.

DOCUMENT 1 ({file1.filename}):
{text1[:3000]}

DOCUMENT 2 ({file2.filename}):
{text2[:3000]}"""

        raw = await ask_ai(prompt)
        try:
            clean = raw.strip().replace("```json", "").replace("```", "").strip()
            result = json.loads(clean)
            # Force all values to strings to prevent React rendering errors
            for key in ["similarities", "unique_doc1", "unique_doc2", "summary"]:
                val = result.get(key, "")
                if isinstance(val, dict):
                    result[key] = " | ".join(f"{k}: {v}" for k, v in val.items())
                elif isinstance(val, list):
                    result[key] = ", ".join(str(v) for v in val)
                else:
                    result[key] = str(val) if val else ""
        except Exception:
            result = {
                "similarities": "Could not parse response.",
                "unique_doc1": "",
                "unique_doc2": "",
                "summary": raw[:500] if raw else ""
            }
        return result
    except Exception as e:
        return {"error": str(e)}


# ══════════════════════════════════════════════
# EXTRACT KEYWORDS  →  POST /extract-keywords
# ══════════════════════════════════════════════
@router.post("/extract-keywords")
async def extract_keywords(
    file: UploadFile = File(...),
):
    try:
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        document_text = read_file(file_path)

        prompt = f"""You are a document analyst specializing in keyword extraction.

Analyze the following document and return ONLY a valid JSON object with these EXACT keys:
- "keywords": array of 10-15 key term strings (each item must be a plain string)
- "topics": array of 4-6 main topic strings
- "entities": array of up to 10 entity strings (people, orgs, places)
- "themes": array of 3-5 theme strings
- "summary": a single plain string (2-3 sentences about the document)

IMPORTANT: Every array item must be a plain string. No nested objects.
Return ONLY JSON, no markdown, no extra text.

DOCUMENT:
{document_text[:5000]}"""

        raw = await ask_ai(prompt)
        try:
            clean = raw.strip().replace("```json", "").replace("```", "").strip()
            result = json.loads(clean)
            # Force all array values to lists of strings
            for key in ["keywords", "topics", "entities", "themes"]:
                val = result.get(key, [])
                if isinstance(val, list):
                    result[key] = [str(item) if not isinstance(item, str) else item for item in val]
                elif isinstance(val, dict):
                    result[key] = list(val.keys())
                else:
                    result[key] = []
            if not isinstance(result.get("summary"), str):
                result["summary"] = str(result.get("summary", ""))
        except Exception:
            result = {"keywords": [], "topics": [], "entities": [], "themes": [], "summary": raw[:400]}
        return result
    except Exception as e:
        return {"error": str(e)}


# ══════════════════════════════════════════════
# REWRITE TONE  →  POST /rewrite-tone
# ══════════════════════════════════════════════
@router.post("/rewrite-tone")
async def rewrite_tone(
    file: UploadFile = File(...),
    tone: str = Form("formal"),
    num_faqs: int = Form(5),
):
    try:
        file_path = f"{UPLOAD_FOLDER}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        document_text = read_file(file_path)

        tone_map = {
            "formal":    "formal, professional, and corporate",
            "casual":    "casual, friendly, and conversational",
            "technical": "technical, precise, and developer-focused",
            "simple":    "simple plain English, easy for anyone to understand",
        }
        tone_desc = tone_map.get(tone, "professional and clear")

        prompt = f"""You are a professional FAQ writer.

Read the document and generate exactly {num_faqs} FAQ entries written in a {tone_desc} style.

Return ONLY valid JSON with this EXACT format (no markdown, no extra text):
{{
  "faqs": [
    {{"question": "...", "answer": "..."}},
    {{"question": "...", "answer": "..."}}
  ]
}}

DOCUMENT:
{document_text[:5000]}"""

        raw = await ask_ai(prompt)
        try:
            clean = raw.strip().replace("```json", "").replace("```", "").strip()
            data = json.loads(clean)
            faqs = data.get("faqs", [])
            # Ensure all questions and answers are strings
            faqs = [
                {
                    "question": str(f.get("question", "")),
                    "answer": str(f.get("answer", ""))
                }
                for f in faqs if isinstance(f, dict)
            ]
        except Exception:
            faqs = [{"question": "Generated FAQ", "answer": raw}]

        return {"faqs": faqs, "tone": tone, "count": len(faqs), "file_name": file.filename}
    except Exception as e:
        return {"faqs": [], "error": str(e)}
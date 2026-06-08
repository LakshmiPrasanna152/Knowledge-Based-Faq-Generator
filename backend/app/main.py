from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chatbot_routes import router as chatbot_router
from app.routes.faq_routes import router as faq_router

app = FastAPI(title="Knowledge-Based FAQ Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Knowledge-Based FAQ Backend Running", "status": "ok"}

# /chat
app.include_router(chatbot_router)

# /generate-faq  /summarize  /compare-docs  /extract-keywords  /rewrite-tone
app.include_router(faq_router)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chatbot_routes import router as chatbot_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TEST ROUTE
@app.get("/")
def home():
    return {
        "message": "Knowledge-Based FAQ Backend Running"
    }

# CHAT ROUTE
app.include_router(chatbot_router)
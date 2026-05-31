from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User
from app.utils.security import hash_password, verify_password
from app.auth import create_access_token

router = APIRouter()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
def signup(data: dict, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == data["email"]
    ).first()

    if existing_user:
        return {"error": "Email already exists"}

    user = User(
        username=data["username"],
        email=data["email"],
        password=hash_password(data["password"])
    )

    db.add(user)
    db.commit()

    return {"message": "User created successfully"}


@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == data["email"]
    ).first()

    if not user:
        return {"error": "User not found"}

    if not verify_password(data["password"], user.password):
        return {"error": "Invalid password"}

    token = create_access_token({
        "sub": user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
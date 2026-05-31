from sqlalchemy import Column, Integer, String, Text, ForeignKey  # type: ignore[import]
from sqlalchemy.orm import relationship  # type: ignore[import]
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    question = Column(Text)
    answer = Column(Text)

class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    question = Column(Text)
    answer = Column(Text)
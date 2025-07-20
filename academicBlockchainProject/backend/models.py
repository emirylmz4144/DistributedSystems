from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    instructor_id = Column(Integer, ForeignKey("users.id"))
    is_approved = Column(Boolean, default=False)  # ✅ Eklenen alan
    status = Column(String, default="submitted")
    created_at = Column(DateTime, default=datetime.utcnow)

class Block(Base):
    __tablename__ = "blocks"
    id = Column(Integer, primary_key=True)
    index = Column(Integer, nullable=False)
    transactions = Column(JSONB, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    previous_hash = Column(String, nullable=False)
    hash = Column(String, nullable=False)
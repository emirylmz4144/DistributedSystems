from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

class ProjectCreate(BaseModel):
    title: str
    description: str
    owner_id: int
    instructor_id: int

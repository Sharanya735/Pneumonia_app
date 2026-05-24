# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: Optional[str]
    email: EmailStr
    role: str
    created_at: datetime
    model_config = {
    "from_attributes": True
}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

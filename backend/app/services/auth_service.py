# app/services/auth_service.py
from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app import models
from datetime import timedelta

def create_user(db: Session, name: str, email: str, password: str, role: str = "user"):
    hashed = hash_password(password)
    user = models.user.User(name=name, email=email, password=hashed, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.user.User).filter(models.user.User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

def create_tokens_for_user(user):
    data = {"user_id": user.id}
    access = create_access_token(data)
    refresh = create_refresh_token(data)
    return access, refresh

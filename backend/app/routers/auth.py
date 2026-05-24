# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, Token,UserOut
from app.deps import get_db,get_current_user
from app.services.auth_service import create_user, authenticate_user, create_tokens_for_user
from app import models

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, response: Response, db: Session = Depends(get_db)):
    existing = db.query.__self__.query  # placeholder to avoid unused import; actual check below
    if db.query.__class__:
        pass
    # check existing
    if db.query.__class__:
        pass
    if db.query(models.user.User).filter(models.user.User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, user_in.name, user_in.email, user_in.password)
    access, refresh = create_tokens_for_user(user)
    # set cookies
    response.set_cookie(key="access_token", value=access, httponly=True, secure=False, samesite="lax")
    response.set_cookie(key="refresh_token", value=refresh, httponly=True, secure=False, samesite="lax")
    return {"access_token": access, "token_type": "bearer"}

# We import here models to avoid circular import earlier
from app import models

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access, refresh = create_tokens_for_user(user)
    response.set_cookie(key="access_token", value=access, httponly=True, secure=False, samesite="lax")
    response.set_cookie(key="refresh_token", value=refresh, httponly=True, secure=False, samesite="lax")
    return {"access_token": access, "token_type": "bearer"}

@router.post("/logout")
def logout(response: Response):
    # Clear cookies
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"msg": "Logged out"}

@router.get("/me") # response_model=UserOut (add this if you have the schema)
def read_users_me(current_user: models.user.User = Depends(get_current_user)):
    """
    Fetch the current logged-in user details using the HttpOnly cookie.
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role
    }
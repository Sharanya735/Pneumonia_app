# app/main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  # <--- IMPORT THIS
from app.database import Base, engine
from app.config import settings
from app.routers import auth as auth_router, scan as scan_router

# create tables (for dev). For migrations, use Alembic.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pneumonia Detector API")

# --- ADD CORS MIDDLEWARE ---
# This must come BEFORE you include your routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Origins from your config
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
# --------------------------

# serve uploaded images at /uploads/scans/<filename>
app.mount("/uploads/scans", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth_router.router)
app.include_router(scan_router.router)
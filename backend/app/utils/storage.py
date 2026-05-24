# app/utils/storage.py
import os
from pathlib import Path
import uuid
from app.config import settings  # <--- IMPORT settings

# Use settings.UPLOAD_DIR
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

def save_file_local(file_bytes: bytes, original_filename: str | None = None) -> str:
    ext = ".jpg"
    if original_filename and "." in original_filename:
        ext = "." + original_filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    
    # Use settings.UPLOAD_DIR
    save_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    
    with open(save_path, "wb") as f:
        f.write(file_bytes)
    
    # return path relative to server (served at /uploads/scans/<filename>)
    # store only the filename (so URLs are predictable)
    return unique_name

# future: implement save_file_s3 with same return type (filename or URL)
# app/schemas/scan.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScanOut(BaseModel):
    id: int
    image_path: str
    prediction: str
    confidence: float
    created_at: datetime
    model_config = {
    "from_attributes": True
}


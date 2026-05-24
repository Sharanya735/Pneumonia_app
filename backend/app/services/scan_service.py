# app/services/scan_service.py
from sqlalchemy.orm import Session
from app import models

def create_scan(db: Session, user_id: int | None, filename: str, prediction: str, confidence: float, raw_probs: str):
    scan = models.scan.Scan(user_id=user_id, image_path=filename, prediction=prediction, confidence=confidence, raw_probs=raw_probs)
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return scan

def get_user_scans(db: Session, user_id: int):
    return db.query(models.scan.Scan).filter(models.scan.Scan.user_id == user_id).order_by(models.scan.Scan.created_at.desc()).all()

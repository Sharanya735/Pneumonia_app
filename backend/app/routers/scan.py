# app/routers/scan.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.ml.predict import predict_from_bytes
from app.utils.storage import save_file_local
from app.services.scan_service import create_scan, get_user_scans
from app.schemas.scan import ScanOut
import io
from app.utils.image_filter import is_mostly_grayscale

router = APIRouter(prefix="/scan", tags=["scan"])

@router.post("/predict")
async def predict_scan(file: UploadFile = File(...)):
    contents = await file.read()

    # Step 1: Quick filter check
    is_gray = is_mostly_grayscale(contents)
    if not is_gray:
        return {"message": "The uploaded image does not look like a chest X-ray.", 
                "prediction": "Unknown", "confidence": None}

    # Step 2: Proceed to model prediction
    try:
        # --- START CHANGE ---
        # predict_from_bytes now returns 4 values
        label, confidence, probs, heatmap_base64 = predict_from_bytes(contents)
        return {
            "prediction": label,
            "confidence": confidence,
            "probabilities": probs, # Keep this for compatibility
            "heatmap": heatmap_base64 # <-- NEW: Send heatmap to frontend
        }
        # --- END CHANGE ---
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

@router.post("/predict/save", response_model=ScanOut)
async def predict_and_save(file: UploadFile = File(...), db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    contents = await file.read()
    try:
        # --- START CHANGE ---
        # Get all 4 values, but we'll only use 3
        label, confidence, probs, _ = predict_from_bytes(contents) 
        # --- END CHANGE ---
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image or prediction failed")
    
    filename = save_file_local(contents, file.filename)
    
    # --- START CHANGE ---
    # Save 'probs' (the list) as a string, just like before.
    # The heatmap is ignored and not saved to the DB.
    scan = create_scan(db, current_user.id, filename, label, confidence, str(probs))
    # --- END CHANGE ---
    return scan

@router.get("/history", response_model=list[ScanOut])
def history(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    scans = get_user_scans(db, current_user.id)
    return scans
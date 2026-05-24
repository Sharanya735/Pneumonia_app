import os
from app.ml.predict import predict_from_bytes
from app.config import settings  # <--- IMPORT settings

def main():
    # --- IMPORTANT ---
    # Change this to the path of a real X-ray image you want to test
    # TEST_IMAGE_PATH = "temp_test/person1000_virus_1681.jpeg" 
    TEST_IMAGE_PATH = "temp_test/ds.jpg" 
    # ---------------

    # 1. Check if the model file exists before trying to test
    if not os.path.exists(settings.MODEL_PATH): # <--- USE settings.
        print(f"❌ Error: Model file not found at {settings.MODEL_PATH}") # <--- USE settings.
        print("Please make sure 'chest_xray_cnn_model.keras' is in 'backend/ml/'") # Corrected path hint
        return

    # 2. Check if the test image exists
    if not os.path.exists(TEST_IMAGE_PATH):
        print(f"❌ Error: Test image not found at {TEST_IMAGE_PATH}")
        print("Please make sure your test image is at that path.")
        return

    print(f"✅ Found model and test image. Loading model (this may take a second)...")

    try:
        # 3. Read the image file as bytes
        with open(TEST_IMAGE_PATH, "rb") as f:
            image_bytes = f.read()
        
        print("🤖 Model loaded. Running prediction...")

        # 4. Call your prediction function with the bytes
        label, confidence, probs = predict_from_bytes(image_bytes)

        # 5. Print the result
        print("\n--- Prediction Result ---")
        print(f"   Label:      {label}")
        print(f"   Confidence: {confidence * 100:.2f}%")
        print(f"   All Probs:  {probs}")
        print("-------------------------")

    except Exception as e:
        print(f"An error occurred during prediction: {e}")
        print("This might be because of a TensorFlow/Keras or file read error.")

if __name__ == "__main__":
    main()
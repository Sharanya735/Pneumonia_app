# app/ml/predict.py
import io
import numpy as np
from PIL import Image
import cv2  # <-- NEW IMPORT
import base64  # <-- NEW IMPORT
import tensorflow as tf  # <-- NEW IMPORT
from tensorflow import keras
import matplotlib.cm as cm  # <-- NEW IMPORT
import traceback  # <-- NEW IMPORT FOR ERROR LOGGING

# Configuration
MODEL_PATH = "app/ml/chest_xray_cnn_model.keras"
CLASS_NAMES = ['NORMAL', 'BACTERIAL', 'VIRAL']
IMG_SIZE = 150
CONFIDENCE_THRESHOLD = 0.6

# Load the model once at import time
model = keras.models.load_model(MODEL_PATH)

# --- This is your correct layer name ---
LAST_CONV_LAYER_NAME = "Conv_1"


def get_img_array(file_bytes):
    """
    Converts image bytes to a processed numpy array for the model
    and returns the original image array for overlay.
    """
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))

    # Original image for overlay
    original_img_arr = keras.preprocessing.image.img_to_array(img)

    # Preprocessed array for model
    arr = original_img_arr / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr, original_img_arr


def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Generates the Grad-CAM heatmap.
    """
    # Create a model that maps the input image to the activations
    # of the last conv layer as well as the output predictions
    grad_model = tf.keras.models.Model(
        model.inputs, [model.get_layer(last_conv_layer_name).output, model.output]
    )

    # Compute the gradient
    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        
        # Access the first tensor in the preds list
        class_channel = preds[0][:, pred_index]

    # Gradient of the output neuron with regard to the last conv layer
    grads = tape.gradient(class_channel, last_conv_layer_output)

    # Mean intensity of the gradient over a specific feature map channel
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # Multiply each channel in the feature map array by "how important"
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # For visualization, we'll normalize the heatmap
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()


def overlay_heatmap_on_image(original_img_arr, heatmap, alpha=0.4):
    """
    Applies the heatmap as an overlay on the original image.
    Returns a base64-encoded string of the final image.
    """
    # Rescale heatmap to a range 0-255
    heatmap = np.uint8(255 * heatmap)

    # Use jet colormap to colorize heatmap
    jet = cm.get_cmap("jet")
    jet_colors = jet(np.arange(256))[:, :3]
    jet_heatmap = jet_colors[heatmap]

    # Create an RGB heatmap
    jet_heatmap = keras.preprocessing.image.array_to_img(jet_heatmap)
    jet_heatmap = jet_heatmap.resize((original_img_arr.shape[1], original_img_arr.shape[0]))
    jet_heatmap = keras.preprocessing.image.img_to_array(jet_heatmap)

    # Superimpose the heatmap on original image
    superimposed_img = jet_heatmap * alpha + original_img_arr
    superimposed_img = keras.preprocessing.image.array_to_img(superimposed_img)

    # Convert to bytes
    buffered = io.BytesIO()
    superimposed_img.save(buffered, format="JPEG")

    # Encode to base64
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str


def predict_from_bytes(file_bytes):
    """
    Takes image bytes, preprocesses, predicts, generates heatmap,
    and returns label, confidence, raw probs, and heatmap string.
    """
    # Get preprocessed array and original image array
    arr, original_img_arr = get_img_array(file_bytes)

    # --- Standard Prediction ---
    prediction = model.predict(arr)[0]
    class_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))
    probs_list = prediction.tolist()

    if confidence < CONFIDENCE_THRESHOLD:
        label = "Uncertain / Unknown"
    else:
        label = CLASS_NAMES[class_index]

    # --- Grad-CAM Heatmap Generation (always run, for all predictions) ---
    # We always use class_index so the map highlights the top-class regions.
    # For "Uncertain / Unknown" we fall back to the raw argmax class so grad-cam
    # still has a meaningful target neuron.
    heatmap_base64 = None
    try:
        heatmap = make_gradcam_heatmap(arr, model, LAST_CONV_LAYER_NAME, pred_index=class_index)
        heatmap_base64 = overlay_heatmap_on_image(original_img_arr, heatmap)
    except Exception as e:
        print(f"--- HEATMAP GENERATION FAILED ---")
        traceback.print_exc()
        print(f"---------------------------------")
        heatmap_base64 = None  # Silently fail — frontend handles missing heatmap

    # --- Return all data ---
    return label, confidence, probs_list, heatmap_base64
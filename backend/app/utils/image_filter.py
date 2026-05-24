# app/utils/image_filter.py
import io
from PIL import Image
import numpy as np

def is_mostly_grayscale(bytes_img, color_ratio_threshold=0.1):
    """
    Quick check to detect if an image is likely a grayscale chest X-ray.
    Returns True if grayscale, False if colorful (e.g., photo, document, etc.)
    """
    img = Image.open(io.BytesIO(bytes_img)).convert('RGB')
    arr = np.array(img) / 255.0
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

    color_diff = np.abs(r - g) + np.abs(g - b) + np.abs(r - b)
    color_frac = np.mean(color_diff > 0.02)  # fraction of colored pixels
    return color_frac < color_ratio_threshold  # True -> likely grayscale

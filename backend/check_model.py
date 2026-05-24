from tensorflow import keras

# Loads your exact model file
model = keras.models.load_model("app/ml/chest_xray_cnn_model.keras")

# Prints the model's structure
print("--- MY MODEL SUMMARY ---")
model.summary()
print("------------------------")
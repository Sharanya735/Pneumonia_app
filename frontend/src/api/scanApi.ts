// frontend/src/api/scanApi.ts
import apiClient from './apiClient';

// 1. Update the interface
export interface PredictionResult {
  prediction: string;
  confidence: number;
  heatmap: string; // <-- NEW: Add the heatmap property
  // We'll ignore the 'probabilities' list for now
}

// 2. Create a dedicated function for the API call
export const analyzeImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // 3. Use the apiClient
    const response = await apiClient.post<PredictionResult>(
      '/scan/predict', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    // 4. Return the data directly
    return response.data;
  } catch (error) {
    console.error("Error in analyzeImageApi:", error);
    // 5. Re-throw the error
    throw error;
  }
};
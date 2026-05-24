// frontend/src/api/apiClient.ts
import axios from 'axios';

// Use Vite's dev proxy (/api → http://127.0.0.1:8000) to avoid CORS issues.
// In production, replace with the real backend URL.
const apiClient = axios.create({
  baseURL: '/api',
});

export default apiClient;
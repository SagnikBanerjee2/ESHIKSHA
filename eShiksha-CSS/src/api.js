import axios from "axios";

// 🔥 AUTOMATIC URL SELECTION
// If your browser says "localhost", connect to your LOCAL backend.
// Otherwise, connect to your LIVE Render backend.
const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000/api"           // Local Development URL
  : "https://eshiksha-backend.onrender.com/api";  // Live Production URL

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically for protected routes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

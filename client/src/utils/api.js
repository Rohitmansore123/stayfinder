import axios from "axios";

// Axios instance with base URL (configurable via environment)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // Fallback for local development
});

// Request Interceptor: Automatically adds token to headers
API.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  // Normalize token (strip any accidental 'Bearer ' prefix)
  if (token && token.toLowerCase().startsWith("bearer ")) {
    token = token.replace(/^(bearer )/i, "");
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handles 401 errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, remove token and redirect to login (with notice)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login?sessionExpired=1";
    }
    return Promise.reject(error);
  },
);

export default API;

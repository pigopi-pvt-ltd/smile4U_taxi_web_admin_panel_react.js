import axios from "axios";
import toast from "react-hot-toast";

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://p69ewng0uhoyo2jaeq93jpjb.82.29.164.173.sslip.io";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log("Full URL:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    
    if (error.code === "ERR_NETWORK") {
      console.error("Network error - Backend might not be running");
      toast.error("Cannot connect to server. Make sure backend is running");
    } else if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      toast.error("You do not have permission");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    return Promise.reject(error);
  },
);

export default api;
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://p69ewng0uhoyo2jaeq93jpjb.82.29.164.173.sslip.io";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error("API Error Response:", error.response);

    if (error.code === "ERR_NETWORK") {
      toast.error("Cannot connect to server. Verify your backend is running.");
    } else if (error.response?.status === 401) {
      // Session expired or token invalid in production
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // Delay slightly so the user can read why they got logged out
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else if (error.response?.status === 403) {
      toast.error("You do not have permission to view this resource.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default api;
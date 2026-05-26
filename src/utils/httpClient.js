import axios from "axios";
import toast from "react-hot-toast";

// Use empty baseURL to use Vite proxy
const api = axios.create({
  baseURL: "https://p69ewng0uhoyo2jaeq93jpjb.82.29.164.173.sslip.io", // Empty = use current origin (localhost:5000) with proxy
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
    console.log(
      `📤 API Request: ${config.method?.toUpperCase()} ${config.url}`,
    );
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
    console.log(
      `📥 API Response: ${response.config.url} - Status: ${response.status}`,
    );
    return response;
  },
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Network error - Backend might not be running");
      toast.error("Cannot connect to server. Make sure backend is running");
    } else if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      toast.error("You do not have permission");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
  },
);

export default api;


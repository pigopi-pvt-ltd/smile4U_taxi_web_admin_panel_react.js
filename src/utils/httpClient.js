import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://p69ewng0uhoyo2jaeq93jpjb.82.29.164.173.sslip.io";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor – logs token presence
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`   Auth header: ${config.headers.Authorization ? "✅ present" : "❌ missing"}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – logs 401/403 but does NOT logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 || status === 403) {
      console.error(`🚨 AUTH ERROR (${status}) on ${url}`);
      console.error("   Response body:", error.response?.data);
      console.error("   Token from localStorage:", localStorage.getItem("accessToken")?.slice(0, 30) + "...");
      //  DO NOT clear tokens or redirect 
      toast.error(`Auth failed: ${error.response?.data?.message || status}`);
      return Promise.reject(error);
    }

    // Other errors (network, 500, etc.)
    if (error.code === "ERR_NETWORK") {
      toast.error("Cannot connect to server.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong.");
    }
    return Promise.reject(error);
  }
);

export default api;
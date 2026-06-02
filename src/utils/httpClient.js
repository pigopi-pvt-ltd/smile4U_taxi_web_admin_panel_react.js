import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "https://p69ewng0uhoyo2jaeq93jpjb.82.29.164.173.sslip.io";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong.");
    }
    return Promise.reject(error);
  }
);

export default api;
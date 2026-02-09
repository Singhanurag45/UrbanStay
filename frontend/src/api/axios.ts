import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  //  timeout: 10000, // ⏳ Prevent infinite wait
});

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // 1. Check if the user is actually offline first
    if (!navigator.onLine) {
       toast.error("No internet connection. Please check your network.");
       return Promise.reject(error);
    }

    // ⏳ 2. Server took too long to respond
    if (error.code === "ECONNABORTED") {
      toast.error("Request timed out. Server might be slow.");
    }

    // 🌐 3. Network Error but user is online -> Likely Server Down or CORS
    else if (!error.response) {
      toast.error("Server is unreachable. It might be down.");
    }
    
    // 4. Server responded with an error code (4xx, 5xx)
    else {
        // Optional: specific handling for 500 vs 400
        // toast.error(error.response.data.message || "Something went wrong");
    }

    return Promise.reject(error);
  }
);

export default api;

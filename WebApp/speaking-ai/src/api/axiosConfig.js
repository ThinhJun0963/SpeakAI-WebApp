import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5232/api", // Thay đổi URL theo BE của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor để xử lý token
axiosInstance.interceptors.request.use(
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

export default axiosInstance;

// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://sai.runasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data.result || response.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// Thêm các phương thức của courseService vào đây
export const courseApi = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/courses");
      console.log("Raw response from axiosInstance:", response);
      return response;
    } catch (error) {
      console.error("Error in courseApi.getAll:", error);
      throw error;
    }
  },

  create: async (courseData) => {
    try {
      const response = await axiosInstance.post("/courses", courseData);
      console.log("Create course response:", response);
      return response;
    } catch (error) {
      console.error("Error in courseApi.create:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/courses/${id}`);
      console.log("Delete course response:", response);
      return response;
    } catch (error) {
      console.error("Error in courseApi.delete:", error);
      throw error;
    }
  },

  update: async (id, courseData) => {
    try {
      const response = await axiosInstance.put(`/courses/${id}`, courseData);
      console.log("Update course response:", response);
      return response;
    } catch (error) {
      console.error("Error in courseApi.update:", error);
      throw error;
    }
  },
};

export default axiosInstance;

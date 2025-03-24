import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // Dùng proxy của Netlify
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào header nếu có
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

// Xử lý response
axiosInstance.interceptors.response.use(
  (response) => response.data.result || response.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// Course API (CRUD)
export const courseApi = {
  getAll: async () => {
    try {
      return await axiosInstance.get("/courses");
    } catch (error) {
      console.error("Error fetching courses:", error.message);
      throw error;
    }
  },
  create: async (courseData) => {
    try {
      return await axiosInstance.post("/courses", courseData);
    } catch (error) {
      console.error("Error creating course:", error.message);
      throw error;
    }
  },
  update: async (id, courseData) => {
    try {
      return await axiosInstance.put(`/courses/${id}`, courseData);
    } catch (error) {
      console.error("Error updating course:", error.message);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      return await axiosInstance.delete(`/courses/${id}`);
    } catch (error) {
      console.error("Error deleting course:", error.message);
      throw error;
    }
  },
};

// Auth API
export const loginUser = async (credentials) => {
  try {
    return await axiosInstance.post("/auth/sign-in", credentials);
  } catch (error) {
    throw new Error(error.message || "Login Failed");
  }
};

export default axiosInstance;

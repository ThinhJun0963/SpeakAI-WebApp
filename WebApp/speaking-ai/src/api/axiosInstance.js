import axios from "axios";

// Create axios instance with dynamic base URL and timeout
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://sai.runasp.net/api", // Dynamic or fallback URL
  // No default headers to allow axios to set Content-Type based on FormData
});

// Request interceptor for token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // Let axios set Content-Type to multipart/form-data automatically for FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with enhanced error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data?.message || error.message);
  }
);

export const courseApi = {
  getAll: () => axiosInstance.get("/courses"),
  getDetails: (id) => axiosInstance.get(`/courses/${id}/details`),
  create: (courseData) => axiosInstance.post("/courses", courseData), // Handles FormData or JSON
  update: (id, courseData) => axiosInstance.put(`/courses/${id}`, courseData),
  delete: (id) => axiosInstance.delete(`/courses/${id}`),
  addTopic: (courseId, topicData) =>
    axiosInstance.post(`/courses/${courseId}/topic`, topicData),
  getTopic: (topicId) => axiosInstance.get(`/courses/topic/${topicId}`),
  updateTopic: (topicId, topicData) =>
    axiosInstance.put(`/courses/topic/${topicId}`, topicData),
  deleteTopic: (topicId) => axiosInstance.delete(`/courses/topic/${topicId}`),
  addExercise: (topicId, exerciseData) =>
    axiosInstance.post(`/courses/topics/${topicId}/exercises`, exerciseData),
  getExercise: (exerciseId) =>
    axiosInstance.get(`/courses/exercises/${exerciseId}`),
  updateExercise: (exerciseId, exerciseData) =>
    axiosInstance.put(`/courses/exercises/${exerciseId}`, exerciseData),
  deleteExercise: (exerciseId) =>
    axiosInstance.delete(`/courses/exercise/${exerciseId}`),
  getPaged: (params) => axiosInstance.get("/courses/paged", { params }),
  getExerciseProgress: (exerciseId) =>
    axiosInstance.get(`/courses/exerciseee`, { params: { exerciseId } }),
};

export const voucherApi = {
  getAll: () => axiosInstance.get("/Voucher"),
  getById: (id) => axiosInstance.get(`/Voucher/${id}`),
  getByCode: (voucherCode) => axiosInstance.get(`/Voucher/${voucherCode}`),
  create: (voucherData) => axiosInstance.post("/Voucher", voucherData),
  update: (id, voucherData) => axiosInstance.put(`/Voucher/${id}`, voucherData),
  delete: (id) => axiosInstance.delete(`/Voucher/${id}`),
  checkAndDisable: () => axiosInstance.post("/Voucher/check-and-disable"),
  getByCode: (voucherCode) =>
    axiosInstance.get(`/api/Voucher/${voucherCode}`, {
      headers: { Accept: "text/plain" },
    }),
};

export const transactionApi = {
  getList: (status, pageNumber, pageSize) => {
    const params = { PageNumber: pageNumber, PageSize: pageSize };
    if (status && status !== "All") params.Status = status;
    return axiosInstance.get("/transactions", { params });
  },
  getUserTransactions: (userId, status, pageNumber, pageSize) => {
    const params = { PageNumber: pageNumber, PageSize: pageSize };
    if (status && status !== "All") {
      params.Status = status;
    }
    return axiosInstance.get(`/transactions/users/${userId}`, { params });
  },
};

export const userApi = {
  getUserById: (userId) => axiosInstance.get(`/users/${userId}`),
};

export default axiosInstance;

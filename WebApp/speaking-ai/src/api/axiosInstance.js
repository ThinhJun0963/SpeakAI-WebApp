import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data.result || response.data,
  (error) => Promise.reject(error.response?.data || error)
);

export const courseApi = {
  getAll: () => axiosInstance.get("/courses"),
  getDetails: (id) => axiosInstance.get(`/courses/${id}/details`),
  create: (courseData) => axiosInstance.post("/courses", courseData),
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
    axiosInstance.get(`/courses/exercise/${exerciseId}`),
  updateExercise: (exerciseId, exerciseData) =>
    axiosInstance.put(`/courses/exercise/${exerciseId}`, exerciseData),
  deleteExercise: (exerciseId) =>
    axiosInstance.delete(`/courses/exercise/${exerciseId}`),
};

export const voucherApi = {
  getAll: () => axiosInstance.get("/Voucher"),
  getById: (id) => axiosInstance.get(`/Voucher/id/${id}`),
  create: (voucherData) => axiosInstance.post("/Voucher", voucherData),
  update: (id, voucherData) =>
    axiosInstance.put(`/Voucher/id/${id}`, voucherData),
  delete: (id) => axiosInstance.delete(`/Voucher/id/${id}`),
};

export default axiosInstance;

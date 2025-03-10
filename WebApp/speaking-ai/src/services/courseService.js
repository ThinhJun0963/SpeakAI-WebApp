// src/api/courseService.js
import axiosInstance from "../api/axiosInstance";

export const courseService = {
  getAll: () => axiosInstance.get("/courses"),
  create: (courseData) => axiosInstance.post("/courses", courseData),
  delete: (id) => axiosInstance.delete(`/courses/${id}`),
};

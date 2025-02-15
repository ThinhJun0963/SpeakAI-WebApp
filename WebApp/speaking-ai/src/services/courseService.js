import api from "./api";

export const courseService = {
  getAll: () => api.get("/Course/get-all"),
  getById: (id) => api.get(`/Course/${id}`),
  create: (data) => api.post("/Course", data),
  update: (id, data) => api.put(`/Course/${id}`, data),
  delete: (id) => api.delete(`/Course/${id}`),
};

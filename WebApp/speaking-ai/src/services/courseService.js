import api from "./api";

export const courseService = {
  getAll: () => api.get("/Course/get-all"),
  getById: (id) => api.get(`/Course/${id}`),
  // create: (data) => api.post("/Course", data),
  create: (courseData) =>
    api.post("/Course", {
      ...courseData,
      isPremium: !courseData.isFree, // Thêm isPremium dựa vào isFree
    }),
  update: (id, data) => api.put(`/Course/${id}`, data),
  delete: (id) => api.delete(`/Course/${id}`),
};

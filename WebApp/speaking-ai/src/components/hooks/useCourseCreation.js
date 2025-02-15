import { useState } from "react";
import { courseService } from "../../services/courseService";

export const useCourseCreation = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCourse = async (courseData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.create(courseData);
      onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create course";
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  return { createCourse, loading, error };
};

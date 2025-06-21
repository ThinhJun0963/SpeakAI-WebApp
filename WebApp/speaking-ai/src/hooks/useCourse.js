import { useState, useCallback } from "react";
import { courseService } from "../../services/courseService";

export const useCourse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCourse = useCallback(async (courseData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await courseService.createCourse(courseData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createCourse,
  };
};

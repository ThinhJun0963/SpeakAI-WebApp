// src/hooks/useSidebar.js
import { useState, useEffect } from "react";
import { courseApi } from "../api/axiosInstance";

const useSidebar = () => {
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const coursesResponse = await courseApi.getAll();

      setCourseCount(
        coursesResponse?.result?.length || coursesResponse?.length || 0
      );
    } catch (err) {
      setError(`Failed to fetch counts: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return { courseCount, loading, error };
};

export default useSidebar;

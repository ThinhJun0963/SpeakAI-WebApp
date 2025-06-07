// src/hooks/useAdminData.js
import { useState, useEffect } from "react";
import { courseApi, voucherApi } from "../api/axiosInstance";

export const useAdminData = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesResponse, vouchersResponse] = await Promise.all([
          courseApi.getAll(),
          voucherApi.getAll(),
        ]);
        setCourses(coursesResponse?.result || coursesResponse || []);
        setVouchers(vouchersResponse?.result || vouchersResponse || []);
      } catch (err) {
        setError("Failed to load admin data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { sidebarOpen, setSidebarOpen, loading, courses, vouchers, error };
};

export default useAdminData;

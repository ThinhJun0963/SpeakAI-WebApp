import { useState, useEffect } from "react";
import { courseApi, voucherApi } from "../api/axiosInstance";

const useAdminData = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
        setError("Failed to load data: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { sidebarOpen, setSidebarOpen, loading, courses, vouchers, error };
};

export default useAdminData;

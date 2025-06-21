import { useContext, useEffect, useState } from "react";
import ApiContext from "../context/ApiContext";

const useSidebar = () => {
  const { authApi, courseApi, voucherApi } = useContext(ApiContext);
  const [courseCount, setCourseCount] = useState(0);
  const [voucherCount, setVoucherCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [courses, vouchers] = await Promise.all([
          courseApi.getCourses(),
          voucherApi.getVouchers(),
        ]);
        setCourseCount(courses.length);
        setVoucherCount(vouchers.length);
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [courseApi, voucherApi]);

  const handleLogout = async () => {
    await authApi.logout();
    localStorage.clear();
    window.location.href = "/login"; // Redirect for simplicity
  };

  return { courseCount, voucherCount, loading, handleLogout };
};

export default useSidebar;

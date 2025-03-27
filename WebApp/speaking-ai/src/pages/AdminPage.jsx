import React, { useState, useEffect, memo } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/dashboard/Header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { courseApi, voucherApi } from "../api/axiosInstance";

const MemoizedOutlet = memo(
  () => <Outlet />,
  () => true
);

const AdminPage = () => {
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

  if (error) {
    return (
      <motion.div
        className="container mx-auto px-4 py-8 text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Nút toggle cho mobile */}
      <MobileToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-40 ${
          sidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <Sidebar
          isCollapsed={!sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          loading={loading}
          courseCount={courses.length}
          voucherCount={vouchers.length}
        />
      </div>

      {/* Nội dung chính */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <Header className="w-full fixed top-0 left-0 z-30" />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-16 p-6 min-h-screen overflow-auto"
        >
          <MemoizedOutlet context={{ loading, courses, vouchers }} />
        </motion.main>
      </div>
    </div>
  );
};

const MobileToggle = ({ sidebarOpen, setSidebarOpen }) => (
  <div className="lg:hidden fixed top-4 left-4 z-50">
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300 hover:text-blue-600 focus:outline-none"
    >
      {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  </div>
);

export default AdminPage;

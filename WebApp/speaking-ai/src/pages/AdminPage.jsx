import React from "react";
import { motion } from "framer-motion";
import useAdminData from "../hooks/useAdminData";
import MobileToggle from "../components/layout/MobileToggle";
import SidebarContainer from "../components/layout/SidebarContainer";
import MainContent from "../components/layout/MainContent";
import { MemoizedOutlet } from "../components/layout/MemoizedOutlet";

const AdminPage = () => {
  const { sidebarOpen, setSidebarOpen, loading, courses, vouchers, error } =
    useAdminData();

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
      <MobileToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SidebarContainer
        isCollapsed={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        loading={loading}
        courseCount={courses.length}
        voucherCount={vouchers.length}
      />
      <MainContent sidebarOpen={sidebarOpen}>
        <MemoizedOutlet context={{ loading, courses, vouchers }} />
      </MainContent>
    </div>
  );
};

export default AdminPage;

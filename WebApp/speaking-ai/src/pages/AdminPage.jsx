import React, { useState, memo } from "react"; // Thêm memo
import { Menu, X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/dashboard/Header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

// Memo hóa Outlet để tránh re-render không cần thiết
const MemoizedOutlet = memo(
  () => <Outlet />,
  () => true
);

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <MobileToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <motion.div
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
        className="fixed lg:static z-40"
      >
        <Sidebar
          isCollapsed={!sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </motion.div>

      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-16 p-6 min-h-screen overflow-auto"
        >
          <MemoizedOutlet /> {/* Sử dụng phiên bản memo hóa */}
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

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/dashboard/Header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <MobileToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <motion.div
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
        className="fixed lg:static z-40"
      >
        <Sidebar />
      </motion.div>

      {/* Main content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-16 p-6 min-h-screen overflow-auto"
        >
          <Outlet />
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

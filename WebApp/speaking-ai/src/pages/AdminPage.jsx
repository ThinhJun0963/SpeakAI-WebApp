import React, { useState } from "react";
import Header from "../components/dashboard/Header";
import { userStats, recentActivity } from "../data/dashboardData";
import { X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import DashboardPage from "./DashboardHome";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <MobileToggle sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <Header />

        <main className="pt-16 p-6 min-h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Mobile Toggle Component
const MobileToggle = ({ sidebarOpen, setSidebarOpen }) => (
  <div className="lg:hidden fixed top-4 left-4 z-50">
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-blue-600 focus:outline-none"
    >
      {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  </div>
);

export default AdminDashboard;

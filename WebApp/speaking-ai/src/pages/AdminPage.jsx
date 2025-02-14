import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const AdminPage = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {" "}
        {/* ml-64 to offset fixed sidebar */}
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-64 h-16 bg-white shadow-sm z-10">
          <Header />
        </div>
        {/* Main Content with proper padding */}
        <main className="pt-16 p-6 min-h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;

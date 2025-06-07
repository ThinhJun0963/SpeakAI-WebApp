import React from "react";
import { Menu, X } from "lucide-react";

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

export default MobileToggle;

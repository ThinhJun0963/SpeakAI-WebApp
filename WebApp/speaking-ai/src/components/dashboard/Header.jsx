import React from "react";
import { Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm p-4 fixed top-0 w-full z-30">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div />
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer transition-transform duration-300 hover:scale-110" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transition-transform duration-300 hover:scale-110"></span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer transition-transform duration-300 hover:scale-105">
            <img
              alt="Admin"
              className="h-8 w-8 rounded-full transition-transform duration-300 hover:scale-110"
            />
            <span className="font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search users, content, or reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-1 text-gray-400 hover:text-blue-500 focus:outline-none">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="hidden md:flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">
              Welcome, QThinh
            </span>
            <button className="flex items-center text-gray-600 hover:text-blue-600">
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

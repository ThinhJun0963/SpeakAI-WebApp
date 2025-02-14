import React from "react";
import { Bell, Search } from "lucide-react";

const Header = () => {
  return (
    <header className=" bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-10 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="pl-10 pr-4 py-2 border rounded-lg 
              transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              hover:shadow-md"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer transition-transform duration-300 hover:scale-110" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transition-transform duration-300 hover:scale-110">
              5
            </span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer transition-transform duration-300 hover:scale-105">
            <img
              src="/api/placeholder/32/32"
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

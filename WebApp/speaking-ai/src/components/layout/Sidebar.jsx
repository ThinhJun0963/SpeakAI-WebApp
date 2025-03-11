import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  Settings,
  CreditCard,
  BarChart2,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Calendar, label: "Bookings", path: "/bookings" },
  { icon: Users, label: "Courses", path: "/courses" },
  { icon: CreditCard, label: "Payments", path: "/payments" },
  { icon: BarChart2, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8 hover:text-blue-400 transition-colors duration-300">
          Booking Admin
        </h1>
        <nav>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer 
                transition-all duration-300 ease-in-out transform hover:scale-105
                ${
                  activeItem === item.path
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "hover:bg-gray-800"
                }`}
              onClick={() => setActiveItem(item.path)}
            >
              <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span className="transition-colors duration-300">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-0 w-full p-4">
        <div className="flex items-center space-x-3 p-3 cursor-pointer transition-all duration-300 hover:bg-red-600 rounded-lg">
          <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

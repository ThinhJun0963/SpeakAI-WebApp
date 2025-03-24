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
  Menu,
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  // { icon: Calendar, label: "Bookings", path: "/bookings" },
  { icon: Users, label: "Courses", path: "/courses" },
  // { icon: CreditCard, label: "Payments", path: "/payments" },
  // { icon: BarChart2, label: "Reports", path: "/reports" },
  // { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  return (
    <div
      className={`h-screen bg-gray-900 text-white fixed left-0 top-0 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1
              className="text-2xl font-bold hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              onClick={toggleSidebar}
            >
              Booking Admin
            </h1>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <Menu
                className="h-8 w-8 cursor-pointer text-white hover:text-blue-400 transition-all duration-300"
                onClick={toggleSidebar}
              />
            </div>
          )}
        </div>
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-800 ${
                activeItem === item.path ? "bg-blue-600 hover:bg-blue-700" : ""
              }`}
              onClick={() => setActiveItem(item.path)}
            >
              <item.icon className="h-5 w-5 min-w-[20px]" />
              {!isCollapsed && (
                <span className="ml-3 transition-colors duration-300">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-0 w-full p-4">
        <div
          className="flex items-center p-3 cursor-pointer transition-all duration-300 hover:bg-red-600 rounded-lg"
          onClick={() => console.log("Logout")}
        >
          <LogOut className="h-5 w-5 min-w-[20px]" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

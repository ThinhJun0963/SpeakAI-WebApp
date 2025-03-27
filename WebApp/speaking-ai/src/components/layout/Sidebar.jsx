import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  Users,
  Settings,
  CreditCard,
  BarChart2,
  LogOut,
  Menu,
  Tag,
} from "lucide-react";
import { Modal } from "antd";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Courses", path: "/courses" },
  { icon: Tag, label: "Vouchers", path: "/vouchers" },
  { icon: CreditCard, label: "Transactions", path: "/transactions" },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      // Giả sử bạn có một hàm logout, nếu không thì bỏ qua phần này
      Modal.success({
        title: "Đăng xuất thành công",
        content: "Bạn đã đăng xuất khỏi hệ thống.",
        centered: true,
        okButtonProps: { className: "bg-blue-500" },
        onOk: () => navigate("/login"),
      });
    } catch (err) {
      Modal.error({
        title: "Đăng xuất thất bại",
        content: "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.",
        centered: true,
      });
    }
  };

  return (
    <motion.div
      className={`h-screen bg-gray-900 text-white fixed left-0 top-0 transition-all duration-300 shadow-lg ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      initial={{ width: isCollapsed ? 64 : 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1
              className="text-2xl font-bold hover:text-blue-400 transition-colors duration-300 cursor-pointer"
              onClick={toggleSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Booking Admin
            </motion.h1>
          )}
          {isCollapsed && (
            <motion.div
              className="flex justify-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Menu
                className="h-8 w-8 cursor-pointer text-white hover:text-blue-400 transition-all duration-300"
                onClick={toggleSidebar}
              />
            </motion.div>
          )}
        </div>

        <nav className="mt-8 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-800 ${
                activeItem === item.path ? "bg-blue-600 hover:bg-blue-700" : ""
              }`}
              onClick={() => setActiveItem(item.path)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <item.icon className="h-5 w-5 min-w-[20px]" />
                {!isCollapsed && (
                  <motion.span
                    className="ml-3 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-4">
        <motion.div
          className={`flex items-center p-3 cursor-pointer transition-all duration-300 rounded-lg hover:bg-red-600 ${
            isCollapsed ? "justify-center" : ""
          }`}
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="h-5 w-5 min-w-[20px]" />
          {!isCollapsed && (
            <motion.span
              className="ml-3 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Đăng xuất
            </motion.span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

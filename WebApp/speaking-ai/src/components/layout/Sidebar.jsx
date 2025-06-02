// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Users, CreditCard, LogOut, Menu, Tag } from "lucide-react";
import { Modal, Tooltip, Skeleton } from "antd";

const SidebarSkeleton = () => (
  <div className="h-screen fixed left-0 top-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-40">
    <div className="p-4">
      <Skeleton active title={{ width: "60%" }} paragraph={false} />
    </div>
    <nav className="mt-6 space-y-1 px-2">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="flex items-center p-3">
          <Skeleton avatar active paragraph={false} className="w-full" />
        </div>
      ))}
    </nav>
    <div className="absolute bottom-0 w-full p-4">
      <Skeleton avatar active paragraph={false} className="w-full" />
    </div>
  </div>
);

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/", badge: 0 },
  { icon: Users, label: "Courses", path: "/courses", badge: 0 },
  { icon: Tag, label: "Vouchers", path: "/vouchers", badge: 0 },
  { icon: CreditCard, label: "Transactions", path: "/transactions", badge: 0 },
];

const Sidebar = ({
  isCollapsed,
  toggleSidebar,
  loading,
  courseCount,
  voucherCount,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm logout",
      content: "Are you sure you want to log out?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        // Xóa hết localStorage
        localStorage.clear();
        // Chuyển hướng về trang login
        navigate("/login");
      },
    });
  };

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 },
  };

  const textVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -20 },
  };

  const iconVariants = {
    expanded: { rotate: 0, scale: 1 },
    collapsed: { rotate: 360, scale: 1.1 },
  };

  if (loading) return <SidebarSkeleton />;

  return (
    <motion.div
      className="h-screen fixed left-0 top-0 shadow-xl z-50 bg-gradient-to-b from-gray-900 to-gray-800 text-white"
      variants={sidebarVariants}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <motion.h1
            className="text-xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            onClick={toggleSidebar}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Booking Admin
          </motion.h1>
        )}
        {isCollapsed && (
          <motion.div
            className="flex justify-center w-full"
            variants={iconVariants}
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
          >
            <Menu
              className="h-6 w-6 cursor-pointer text-gray-300 hover:text-blue-400"
              onClick={toggleSidebar}
            />
          </motion.div>
        )}
      </div>

      <nav className="mt-6 space-y-1 px-2">
        {menuItems.map((item, index) => {
          const badgeCount =
            item.label === "Courses"
              ? courseCount
              : item.label === "Vouchers"
              ? voucherCount
              : 0;
          return (
            <Tooltip
              key={index}
              title={isCollapsed ? item.label : ""}
              placement="right"
            >
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 relative ${
                  activeItem === item.path
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setActiveItem(item.path)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center w-full"
                >
                  <motion.div
                    variants={iconVariants}
                    initial="expanded"
                    animate={isCollapsed ? "collapsed" : "expanded"}
                  >
                    <item.icon className="h-5 w-5 min-w-[20px]" />
                  </motion.div>
                  {!isCollapsed && (
                    <motion.span
                      className="ml-3 text-sm font-medium"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {badgeCount > 0 && !isCollapsed && (
                    <motion.span
                      className="absolute right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {badgeCount}
                    </motion.span>
                  )}
                  {badgeCount > 0 && isCollapsed && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {badgeCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4">
        <Tooltip title={isCollapsed ? "Đăng xuất" : ""} placement="right">
          <motion.div
            className={`flex items-center p-3 cursor-pointer transition-all duration-300 rounded-lg hover:bg-red-600 ${
              isCollapsed ? "justify-center" : ""
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
          >
            <motion.div
              variants={iconVariants}
              initial="expanded"
              animate={isCollapsed ? "collapsed" : "expanded"}
            >
              <LogOut className="h-5 w-5 min-w-[20px] text-gray-300 hover:text-white" />
            </motion.div>
            {!isCollapsed && (
              <motion.span
                className="ml-3 text-sm font-medium text-gray-300 hover:text-white"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                Logout
              </motion.span>
            )}
          </motion.div>
        </Tooltip>
      </div>
    </motion.div>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Users, Tag, CreditCard, LogOut, Menu } from "lucide-react";
import { Tooltip } from "antd";
import useSidebar from "../../hooks/useSidebar";
import SidebarSkeleton from "./SidebarSkeleton";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/", badgeKey: null },
  { icon: Users, label: "Courses", path: "/courses", badgeKey: "courseCount" },
  { icon: Tag, label: "Vouchers", path: "/vouchers", badgeKey: "voucherCount" },
  {
    icon: CreditCard,
    label: "Transactions",
    path: "/transactions",
    badgeKey: null,
  },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const { courseCount, voucherCount, loading, handleLogout } = useSidebar();
  const [isOpen, setIsOpen] = useState(!isCollapsed);

  const sidebarVariants = {
    expanded: {
      width: 256,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    collapsed: {
      width: 64,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const textVariants = {
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    hidden: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  const iconVariants = {
    expanded: { rotate: 0, scale: 1 },
    collapsed: { rotate: 360, scale: 1.1, transition: { duration: 0.5 } },
  };

  if (loading) return <SidebarSkeleton />;

  return (
    <motion.nav
      className="h-screen fixed left-0 top-0 shadow-xl z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white overflow-hidden"
      variants={sidebarVariants}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      aria-label="Main navigation"
    >
      <div className="p-4 flex items-center justify-between">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h1
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer"
              onClick={toggleSidebar}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={textVariants}
            >
              Booking Admin
            </motion.h1>
          )}
        </AnimatePresence>
        <motion.div
          className="flex justify-center w-full"
          variants={iconVariants}
          initial="expanded"
          animate={isCollapsed ? "collapsed" : "expanded"}
        >
          <Menu
            className="h-6 w-6 cursor-pointer text-gray-300 hover:text-blue-400"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && toggleSidebar()}
          />
        </motion.div>
      </div>

      <nav className="mt-6 space-y-1 px-2 overflow-y-auto h-[calc(100%-100px)]">
        {menuItems.map((item, index) => {
          const badgeCount =
            item.badgeKey === "courseCount"
              ? courseCount
              : item.badgeKey === "voucherCount"
              ? voucherCount
              : 0;
          return (
            <Tooltip
              key={index}
              title={isCollapsed ? item.label : ""}
              placement="right"
              arrow={false}
            >
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 relative group ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                aria-current={
                  location.pathname === item.path ? "page" : undefined
                }
                onClick={() => setIsOpen(false)}
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
                    <item.icon
                      className="h-5 w-5 min-w-[20px]"
                      aria-hidden="true"
                    />
                  </motion.div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        className="ml-3 text-sm font-medium"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {badgeCount > 0 && (
                    <motion.span
                      className={`absolute text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                        isCollapsed ? "-top-1 -right-1" : "right-3"
                      } bg-red-500`}
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
        <Tooltip
          title={isCollapsed ? "Logout" : ""}
          placement="right"
          arrow={false}
        >
          <motion.div
            className={`flex items-center p-3 cursor-pointer transition-all duration-300 rounded-lg hover:bg-red-600 ${
              isCollapsed ? "justify-center" : ""
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            aria-label="Logout"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleLogout()}
          >
            <motion.div
              variants={iconVariants}
              initial="expanded"
              animate={isCollapsed ? "collapsed" : "expanded"}
            >
              <LogOut className="h-5 w-5 min-w-[20px] text-gray-300 hover:text-white" />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="ml-3 text-sm font-medium text-gray-300 hover:text-white"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Tooltip>
      </div>
    </motion.nav>
  );
};

export default Sidebar;

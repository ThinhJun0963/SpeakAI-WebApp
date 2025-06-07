import React from "react";
import Header from "../dashboard/Header";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const MainContent = ({ sidebarOpen }) => (
  <div
    className={`flex-1 overflow-auto transition-all duration-300 ${
      sidebarOpen ? "lg:ml-64" : "lg:ml-16"
    }`}
  >
    <Header className="w-full fixed top-0 left-0 z-30" />
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-16 p-6 min-h-screen overflow-auto"
    >
      <Outlet />
    </motion.main>
  </div>
);

export default MainContent;

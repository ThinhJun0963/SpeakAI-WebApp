import React from "react";
import Sidebar from "./Sidebar";

const SidebarContainer = ({
  isCollapsed,
  toggleSidebar,
  loading,
  courseCount,
  voucherCount,
}) => (
  <div
    className={`fixed top-0 left-0 h-screen z-40 ${
      isCollapsed ? "block" : "hidden lg:block"
    }`}
  >
    <Sidebar
      isCollapsed={!isCollapsed}
      toggleSidebar={toggleSidebar}
      loading={loading}
      courseCount={courseCount}
      voucherCount={voucherCount}
    />
  </div>
);

export default SidebarContainer;

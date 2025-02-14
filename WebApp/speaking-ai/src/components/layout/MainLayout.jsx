import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

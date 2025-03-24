import React from "react";

const Loader = ({ fullPage = false }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        fullPage ? "fixed inset-0 bg-gray-500 bg-opacity-50 z-50" : "h-64"
      }`}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default Loader;

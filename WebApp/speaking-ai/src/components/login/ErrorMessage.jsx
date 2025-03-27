import React from "react";
import { motion } from "framer-motion";

const ErrorMessage = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-lg bg-red-50 p-4 shadow-sm border border-red-200"
    >
      <div className="flex items-center">
        <svg
          className="h-5 w-5 text-red-500 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-red-700 font-medium">{message}</p>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;

import React from "react";

const LoadingButton = ({ loading, text, loadingText }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading && (
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
        </span>
      )}
      {loading ? loadingText : text}
    </button>
  );
};

export default LoadingButton;

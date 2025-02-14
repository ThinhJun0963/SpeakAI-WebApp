import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="text-sm text-red-700">{message}</div>
    </div>
  );
};

export default ErrorMessage;

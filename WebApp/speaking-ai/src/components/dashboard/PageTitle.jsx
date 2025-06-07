import React from "react";

const PageTitle = ({ title, subtitle }) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
      {title}
    </h1>
    <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
  </div>
);

export default PageTitle;

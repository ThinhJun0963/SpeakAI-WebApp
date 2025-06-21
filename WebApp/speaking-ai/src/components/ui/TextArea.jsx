import React from "react";

const TextArea = ({
  label,
  error,
  rows = 3,
  value = "",
  onChange,
  className = "",
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={handleChange}
        className={`
             w-full p-2 border rounded
             ${error ? "border-red-500" : "border-gray-300"}
             focus:outline-none focus:ring-2 focus:ring-blue-500
             ${className}
           `}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea;

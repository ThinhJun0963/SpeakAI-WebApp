import React from "react";

const Select = ({
  label = "",
  value = "",
  onChange = () => {},
  options = [],
  placeholder = "Select an option",
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {Array.isArray(options) &&
          options.map((option) => (
            <option key={option?.value || ""} value={option?.value || ""}>
              {option?.label || ""}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Select;

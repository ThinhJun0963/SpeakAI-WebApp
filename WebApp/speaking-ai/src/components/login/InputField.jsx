import React from "react";

const InputField = ({
  id,
  name,
  type,
  icon: Icon,
  value,
  onChange,
  placeholder,
  required,
  endIcon,
}) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
          endIcon ? "pr-12" : ""
        }`}
      />
      {endIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {endIcon}
        </div>
      )}
    </div>
  );
};

export default InputField;

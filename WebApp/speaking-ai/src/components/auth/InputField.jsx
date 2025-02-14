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
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
        placeholder={placeholder}
      />
      {endIcon}
    </div>
  );
};

export default InputField;

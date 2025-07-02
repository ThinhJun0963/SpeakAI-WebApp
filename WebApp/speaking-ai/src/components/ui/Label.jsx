// Label.jsx
const Label = ({ children, className = "", ...props }) => {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;

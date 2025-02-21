
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
    <div className="relative rounded-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full pl-10 pr-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder={placeholder}
      />
      {endIcon}
    </div>
  );
};

export default InputField;

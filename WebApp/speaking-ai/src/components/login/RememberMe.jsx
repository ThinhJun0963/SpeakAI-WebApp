
const RememberMe = () => {
  return (
    <div className="flex items-center">
      <input
        id="remember-me"
        name="remember-me"
        type="checkbox"
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
        Remember me
      </label>
    </div>
  );
};

export default RememberMe;

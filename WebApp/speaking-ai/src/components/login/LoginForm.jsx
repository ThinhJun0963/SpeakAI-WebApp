import React from "react";

const LoginForm = ({
  formData,
  loading,
  error,
  showPassword,
  onSubmit,
  onChange,
  onTogglePassword,
  onGoogleLogin,
}) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      <div className="rounded-md -space-y-px">
        <div className="mb-4">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            value={formData.email}
            onChange={onChange}
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={formData.password}
            onChange={onChange}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={onTogglePassword}
          >
            <span className="text-sm text-gray-500">
              {showPassword ? "Hide" : "Show"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember_me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 absolute w-full"></div>
          <div className="px-2 bg-white relative z-10 text-sm text-gray-500">
            Or
          </div>
        </div>

        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.514 0-10 4.486-10 10s4.486 10 10 10c5.419 0 9.708-4.266 9.967-9.589-0.078-0.502-0.078-1.025-0.078-1.526 0-0.301-0.028-0.601-0.079-0.896h-9.89z"
                fill="#4285F4"
              />
              <path
                d="M12.545 10.239h9.89c0.051 0.295 0.079 0.595 0.079 0.896 0 0.501 0 1.024 0.078 1.526-0.259 5.323-4.548 9.589-9.967 9.589-5.514 0-10-4.486-10-10s4.486-10 10-10c2.551 0 4.945 1.025 6.735 2.702l-2.814 2.814c-1.055-0.904-2.423-1.453-3.921-1.453-3.332 0-6.033 2.701-6.033 6.032s2.701 6.032 6.033 6.032c2.798 0 4.733-1.657 5.445-3.972h-5.445v-3.821z"
                fill="#34A853"
              />
              <path
                d="M22.514 11.135c0.051 0.295 0.079 0.595 0.079 0.896 0 0.501 0 1.024 0.078 1.526-0.259 5.323-4.548 9.589-9.967 9.589-2.623 0-5.012-1.007-6.791-2.653l2.75-2.75c0.929 0.832 2.151 1.337 3.492 1.337 2.798 0 4.733-1.657 5.445-3.972h-5.445v-3.821h9.89z"
                fill="#FBBC05"
              />
              <path
                d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-1.341 0-2.563-0.505-3.492-1.337l-2.75 2.75c1.779 1.646 4.168 2.653 6.791 2.653 5.419 0 9.708-4.266 9.967-9.589-0.078-0.502-0.078-1.025-0.078-1.526 0-0.301-0.028-0.601-0.079-0.896h-9.89z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;

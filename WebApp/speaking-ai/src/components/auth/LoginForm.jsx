import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import LoadingButton from "../../components/common/LoadingButton";
import RememberMe from "./RememberMe";

const LoginForm = ({
  formData,
  loading,
  error,
  showPassword,
  onSubmit,
  onChange,
  onTogglePassword,
  onGoogleLogin,
  loadingGoogle,
}) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-50 text-red-600 rounded-md text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
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
            className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white/80 transition-all duration-200"
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
            className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white/80 transition-all duration-200"
            placeholder="Password"
            value={formData.password}
            onChange={onChange}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <RememberMe />
        <div className="text-sm">
          <a
            href="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <LoadingButton
          loading={loading}
          text="Log In"
          loadingText="Logging in..."
        />
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 absolute w-full"></div>
          <div className="px-2 bg-white/80 relative z-10 text-sm text-gray-500">
            Or
          </div>
        </div>
        <GoogleLogin
          onSuccess={onGoogleLogin}
          onError={() => {}}
          size="large"
          theme="outline"
          text="signin_with"
          shape="pill"
          disabled={loadingGoogle}
          className="w-full"
        />
      </div>
    </form>
  );
};

export default LoginForm;

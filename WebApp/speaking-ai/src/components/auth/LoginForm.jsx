import React from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import InputField from "./InputField";
import RememberMe from "./RememberMe";
import ErrorMessage from "./ErrorMessage";
import LoadingButton from "./LoadingButton";


const LoginForm = ({
  formData,
  loading,
  error,
  showPassword,
  onSubmit,
  onChange,
  onTogglePassword,
}) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <InputField
          id="email"
          name="email"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={onChange}
          placeholder="Email address"
          required
        />

        <InputField
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          value={formData.password}
          onChange={onChange}
          placeholder="Password"
          required
          endIcon={
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <RememberMe />
        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot password?
          </a>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <LoadingButton
        loading={loading}
        text="Sign In"
        loadingText="Signing in..."
      />
    </form>
  );
};

export default LoginForm;

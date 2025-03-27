import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import InputField from "../components/login/InputField";
import LoadingButton from "../components/login/LoadingButton";
import ErrorMessage from "../components/login/ErrorMessage";
import { useAuth } from "../components/hooks/useAuth";
import useModal from "../components/hooks/useModal";

const LoginPage = () => {
  const { login, loginWithGoogle, error } = useAuth();
  const { showSuccess, showError } = useModal();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingNormal, setLoadingNormal] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingNormal(true);
    try {
      const role = await login(formData);
      showSuccess("Success", "Login successful!", () =>
        navigateBasedOnRole(role)
      );
    } catch (err) {
      showError("Error", error || "Login failed. Please try again.");
    } finally {
      setLoadingNormal(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoadingGoogle(true);
    try {
      const role = await loginWithGoogle(response.credential);
      showSuccess("Success", "Logged in with Google successfully!", () =>
        navigateBasedOnRole(role)
      );
    } catch (err) {
      showError(
        "Error",
        err.message || "Google login failed. Please try again."
      );
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGoogleError = () => {
    showError("Error", "Google login failed. Please try again.");
  };

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case "Admin":
        navigate("/admin");
        break;
      case "Student":
        navigate("/student");
        break;
      case "Teacher":
        navigate("/teacher");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <motion.div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="mt-2 text-sm text-gray-500">
              Log in to continue your journey
            </p>
          </motion.div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-3 mt-6">
            <InputField
              id="username"
              name="username"
              type="text"
              icon={User}
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            <div>
              <InputField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
              />
              <p className="mt-2 text-right text-sm text-gray-600">
                <a
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot your password?
                </a>
              </p>
            </div>
            <LoadingButton
              loading={loadingNormal}
              text="Log In"
              loadingText="Logging in..."
            />
          </form>

          <div className="mt-4 space-y-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              theme="outline"
              text="signin_with"
              shape="pill"
              disabled={loadingGoogle}
            />
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/sign-up"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign up now
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

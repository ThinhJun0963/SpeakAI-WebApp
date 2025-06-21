import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, Calendar, UserPlus } from "lucide-react";
import InputField from "../../components/common/InputField"; // Updated import
import LoadingButton from "../../components/common/LoadingButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";
import { validatePassword } from "../../utils/validation";

const SignUpPage = () => {
  const { register } = useAuth();
  const { showSuccess, showError } = useModal();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    confirmedPassword: "",
    email: "",
    fullName: "",
    birthday: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmedPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      showSuccess(
        "Success",
        "Registration successful! Please log in to continue.",
        () => setRedirect(true)
      );
    } catch (err) {
      setError(err.message || "Registration failed. Please check your input.");
      showError(
        "Error",
        err.message || "Registration failed. Please check your input."
      );
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
            <p className="mt-2 text-sm text-gray-500">Create your account</p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <ErrorMessage message={error} />
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <InputField
                id="userName"
                name="userName"
                type="text"
                icon={User}
                value={formData.userName}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <InputField
                id="email"
                name="email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <InputField
                id="fullName"
                name="fullName"
                type="text"
                icon={UserPlus}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <InputField
                id="password"
                name="password"
                type="password"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <InputField
                id="confirmedPassword"
                name="confirmedPassword"
                type="password"
                icon={Lock}
                value={formData.confirmedPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <InputField
                id="birthday"
                name="birthday"
                type="date"
                icon={Calendar}
                value={formData.birthday}
                onChange={handleChange}
                placeholder="Birthday"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <LoadingButton
                loading={loading}
                text="Sign Up"
                loadingText="Signing up..."
              />
            </motion.div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Log in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;

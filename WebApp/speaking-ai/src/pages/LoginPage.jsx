import React, { useState } from "react";
import { useAuth } from "../components/hooks/useAuth";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      // Handle successful login (e.g., redirect)
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in 
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </a>
          </p>
        </div>

        <LoginForm
          formData={formData}
          loading={loading}
          error={error}
          showPassword={showPassword}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>
    </div>
  );
};

export default LoginPage;

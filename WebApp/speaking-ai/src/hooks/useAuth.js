import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../../api/authApi";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const login = async ({ username, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(username, password);
      const data = response.data; // Lấy dữ liệu từ response
      if (!data.isSuccess) {
        throw new Error(data.message || "Login failed");
      }
      const { accessToken, refreshToken } = data.result;
      const decodedUser = jwtDecode(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      setUser(decodedUser);
      return decodedUser.role;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.loginWithGoogle(credential);
      const data = response.data;
      if (!data.isSuccess) {
        throw new Error(data.message || "Google login failed");
      }
      const { accessToken, refreshToken } = data.result;
      const decodedUser = jwtDecode(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      setUser(decodedUser);
      return decodedUser.role;
    } catch (err) {
      console.error("Google login error:", err.message || err);
      setError(err.message || "Google login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(formData);
      const data = response.data;
      if (!data.isSuccess) {
        throw new Error(data.message || "Registration failed");
      }
      return { success: true };
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async ({ userId, otpCode }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyOtp(userId, otpCode);
      const data = response.data;
      if (!data.isSuccess) {
        throw new Error(data.message || "OTP verification failed");
      }
      return data.message;
    } catch (err) {
      setError(err.message || "OTP verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.forgotPassword(email);
      const data = response.data;
      if (!data.isSuccess) {
        throw new Error(data.message || "Failed to send reset email");
      }
      return data.message;
    } catch (err) {
      setError(err.message || "Failed to send reset email");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async ({ otp, password, confirmPassword, email }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.resetPassword({
        otp,
        password,
        confirmPassword,
        email,
      });
      const data = response.data;
      if (!data.isSuccess) {
        throw new Error(data.message || "Failed to reset password");
      }
      return data.message;
    } catch (err) {
      setError(err.message || "Failed to reset password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    verifyOtp,
    forgotPassword,
    resetPassword,
  };
};

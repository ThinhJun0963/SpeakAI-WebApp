import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://sai.runasp.net/api";

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
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        userName: username,
        password,
      });
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Login failed");
      }
      const { accessToken, refreshToken } = response.data.result;
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
      console.log("Google credential:", credential);
      const response = await axios.post(`${BASE_URL}/auth/signin-google`, {
        idToken: credential,
      });
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Google login failed");
      }
      const { accessToken, refreshToken } = response.data.result;
      const decodedUser = jwtDecode(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      setUser(decodedUser);
      return decodedUser.role;
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
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
      // Gọi API đăng ký
      const registerResponse = await axios.post(
        `${BASE_URL}/auth/register/customer`,
        {
          userName: formData.userName,
          password: formData.password,
          confirmedPassword: formData.confirmedPassword,
          email: formData.email,
          fullName: formData.fullName,
          birthday: formData.birthday,
          gender: formData.gender,
        }
      );
      if (!registerResponse.data.isSuccess) {
        throw new Error(registerResponse.data.message || "Registration failed");
      }

      // Tự động đăng nhập để lấy accessToken
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        userName: formData.userName,
        password: formData.password,
      });
      if (!loginResponse.data.isSuccess) {
        throw new Error(
          loginResponse.data.message || "Login after registration failed"
        );
      }

      const { accessToken } = loginResponse.data.result;
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.Id; // Lấy userId từ accessToken (trường "Id")

      // Gọi API gửi OTP
      const verifyResponse = await axios.get(`${BASE_URL}/emails/verify`, {
        params: { userID: userId },
      });
      if (!verifyResponse.data.isSuccess) {
        throw new Error(verifyResponse.data.message || "Failed to send OTP");
      }

      return { userId };
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
      const response = await axios.get(`${BASE_URL}/auth/verify/otp`, {
        params: { userId, otpCode },
      });
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "OTP verification failed");
      }
      return response.data.message;
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
      const response = await axios.get(`${BASE_URL}/auth/password/forgot`, {
        params: { email },
      });
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to send reset email");
      }
      return response.data.message;
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
      const response = await axios.post(`${BASE_URL}/auth/password/reset`, {
        otp,
        password,
        confirmPassword,
        email,
      });
      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to reset password");
      }
      return response.data.message;
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

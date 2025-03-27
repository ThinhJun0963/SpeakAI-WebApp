import axios from "axios";

// Định nghĩa base URL trực tiếp
const BASE_URL = import.meta.env.VITE_API_URL || "http://sai.runasp.net/api";

// Các API liên quan đến đăng nhập
export const authApi = {
  login: (username, password) => {
    const payload = { userName: username, password };
    console.log("Login payload:", payload);
    return axios.post(`${BASE_URL}/auth/login`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  loginWithGoogle: (idToken) => {
    const payload = { idToken };
    console.log("LoginWithGoogle payload:", payload);
    return axios.post(`${BASE_URL}/auth/signin-google`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  register: (formData) => {
    const payload = {
      userName: formData.userName,
      password: formData.password,
      confirmedPassword: formData.confirmedPassword,
      email: formData.email,
      fullName: formData.fullName,
      birthday: formData.birthday,
      gender: formData.gender,
    };
    console.log("Register payload:", payload);
    return axios.post(`${BASE_URL}/auth/register/customer`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  verifyOtp: (userId, otpCode) => {
    const payload = { userId, otpCode };
    console.log("VerifyOtp payload:", payload);
    return axios.post(`${BASE_URL}/auth/verify/otp`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  forgotPassword: (email) => {
    console.log("ForgotPassword email:", email); // Thêm log để kiểm tra
    return axios.post(
      `${BASE_URL}/auth/password/forgot?email=${encodeURIComponent(email)}`,
      null,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  },

  resetPassword: ({ otp, password, confirmPassword, email }) => {
    const payload = { otp, password, confirmPassword, email };
    console.log("ResetPassword payload:", payload);
    return axios.post(`${BASE_URL}/auth/password/reset`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  },
};

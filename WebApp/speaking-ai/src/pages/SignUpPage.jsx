import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Mail, Calendar, UserPlus } from "lucide-react";
import { Modal, Input } from "antd";
import InputField from "../components/login/InputField";
import LoadingButton from "../components/login/LoadingButton";
import ErrorMessage from "../components/login/ErrorMessage";
import { useAuth } from "../components/hooks/useAuth";

const SignUpPage = () => {
  const { register, verifyOtp } = useAuth();
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
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Kiểm tra password trước khi gửi
    const passwordRegex = /^(?!.*\s)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must have 8-20 characters, at least 1 special character, and no spaces."
      );
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmedPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { userId } = await register(formData);
      setUserId(userId);
      setOtpModalVisible(true);
      Modal.success({
        title: "Success",
        content:
          "Registration successful! Please check your email to verify your account.",
        centered: true,
        okButtonProps: {
          style: { background: "#52c41a", borderColor: "#52c41a" },
        },
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please check your input.");
      Modal.error({
        title: "Error",
        content: err.message || "Registration failed. Please check your input.",
        centered: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await verifyOtp({ userId, otpCode: otp });
      Modal.success({
        title: "Success",
        content: "Account verified successfully! Please log in.",
        centered: true,
        okButtonProps: {
          style: { background: "#52c41a", borderColor: "#52c41a" },
        },
        onOk: () => setRedirect(true),
      });
      setOtpModalVisible(false);
    } catch (err) {
      setError(err.message || "OTP verification failed. Please try again.");
      Modal.error({
        title: "Error",
        content: err.message || "OTP verification failed. Please try again.",
        centered: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
            <p className="mt-2 text-sm text-gray-500">Create your account</p>
          </motion.div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <LoadingButton
              loading={loading}
              text="Sign Up"
              loadingText="Signing up..."
            />
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Log in
            </a>
          </p>
        </div>
      </motion.div>

      {/* Modal để nhập OTP */}
      <Modal
        title="Verify OTP"
        open={otpModalVisible}
        onOk={handleOtpSubmit}
        onCancel={() => setOtpModalVisible(false)}
        okText="Verify"
        cancelText="Cancel"
        centered
        okButtonProps={{
          style: { background: "#52c41a", borderColor: "#52c41a" },
          disabled: loading,
        }}
      >
        <p>An OTP has been sent to your email. Please enter it below:</p>
        <Input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
          style={{ marginTop: 16 }}
        />
      </Modal>
    </div>
  );
};

export default SignUpPage;

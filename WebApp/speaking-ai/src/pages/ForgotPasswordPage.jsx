import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Modal, Input } from "antd";
import InputField from "../components/login/InputField";
import LoadingButton from "../components/login/LoadingButton";
import ErrorMessage from "../components/login/ErrorMessage";
import { useAuth } from "../components/hooks/useAuth"; // Đã sửa đường dẫn

const ForgotPasswordPage = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const message = await forgotPassword(email);
      setOtpModalVisible(true);
      Modal.success({
        title: "Success",
        content: message || "A reset OTP has been sent to your email.",
        centered: true,
        okButtonProps: {
          style: { background: "#52c41a", borderColor: "#52c41a" },
        },
      });
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
      Modal.error({
        title: "Error",
        content: err.message || "Failed to send reset email. Please try again.",
        centered: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async () => {
    setLoading(true);
    setError(null);

    // Kiểm tra password trước khi gửi
    const passwordRegex = /^(?!.*\s)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must have 8-20 characters, at least 1 special character, and no spaces."
      );
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const message = await resetPassword({
        otp,
        password: newPassword,
        confirmPassword,
        email,
      });
      Modal.success({
        title: "Success",
        content: message || "Your password has been reset successfully!",
        centered: true,
        okButtonProps: {
          style: { background: "#52c41a", borderColor: "#52c41a" },
        },
        onOk: () => setRedirect(true),
      });
      setOtpModalVisible(false);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
      Modal.error({
        title: "Error",
        content: err.message || "Failed to reset password. Please try again.",
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
            <h1 className="text-3xl font-bold text-gray-900">
              Forgot Password
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email to reset your password
            </p>
          </motion.div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleEmailSubmit} className="space-y-6 mt-6">
            <InputField
              id="email"
              name="email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            <LoadingButton
              loading={loading}
              text="Send Reset Link"
              loadingText="Sending..."
            />
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Back to{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Log in
            </a>
          </p>
        </div>
      </motion.div>

      {/* Modal để nhập OTP và mật khẩu mới */}
      <Modal
        title="Reset Password"
        open={otpModalVisible}
        onOk={handleResetSubmit}
        onCancel={() => setOtpModalVisible(false)}
        okText="Reset Password"
        cancelText="Cancel"
        centered
        okButtonProps={{
          style: { background: "#52c41a", borderColor: "#52c41a" },
          disabled: loading,
        }}
      >
        <p>
          An OTP has been sent to your email. Please enter it below along with
          your new password:
        </p>
        <Input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
          style={{ marginTop: 16 }}
        />
        <Input.Password
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          style={{ marginTop: 16 }}
          prefix={<Lock className="h-5 w-5 text-gray-400" />}
        />
        <Input.Password
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          style={{ marginTop: 16 }}
          prefix={<Lock className="h-5 w-5 text-gray-400" />}
        />
      </Modal>
    </div>
  );
};

export default ForgotPasswordPage;

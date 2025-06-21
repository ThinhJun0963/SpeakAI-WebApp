// ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Input, Modal } from "antd";
import InputField from "../components/login/InputField";
import LoadingButton from "../components/login/LoadingButton";
import ErrorMessage from "../components/login/ErrorMessage";
import { useAuth } from "../components/hooks/useAuth";
import useModal from "../components/hooks/useModal";
import { validatePassword } from "../utils/validation";

const ForgotPasswordPage = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const {
    visible,
    showModal,
    hideModal,
    showSuccess,
    showError,
    loading,
    setLoading,
  } = useModal();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const message = await forgotPassword(email);
      showModal();
      showSuccess(
        "Success",
        message || "A reset OTP has been sent to your email."
      );
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
      showError(
        "Error",
        err.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async () => {
    setLoading(true);
    setError(null);

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
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
      showSuccess(
        "Success",
        message || "Your password has been reset successfully!",
        () => setRedirect(true)
      );
      hideModal();
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
      showError(
        "Error",
        err.message || "Failed to reset password. Please try again."
      );
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
              className="bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
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

      <Modal
        title="Reset Password"
        open={visible}
        onOk={handleResetSubmit}
        onCancel={hideModal}
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
          className="bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
        />
        <Input.Password
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          style={{ marginTop: 16 }}
          prefix={<Lock className="h-5 w-5 text-gray-400" />}
          className="bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
        />
        <Input.Password
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          style={{ marginTop: 16 }}
          prefix={<Lock className="h-5 w-5 text-gray-400" />}
          className="bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
        />
      </Modal>
    </div>
  );
};

export default ForgotPasswordPage;

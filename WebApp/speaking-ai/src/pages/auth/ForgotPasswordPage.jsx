// ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Input, Modal } from "antd";
import InputField from "../../components/common/InputField"; // Updated import
import LoadingButton from "../../components/common/LoadingButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";
import { validatePassword } from "../../utils/validation";

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
            <h1 className="text-3xl font-bold text-gray-900">
              Forgot Password
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email to reset your password
            </p>
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
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
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
        closeIcon={<span className="text-gray-500 hover:text-gray-700">×</span>}
        className="rounded-xl"
        transitionName="modal"
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

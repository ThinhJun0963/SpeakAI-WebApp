import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError("");
      const response = await loginUser(credentials);

      // Lưu token và thông tin user nếu cần
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Chuyển hướng sau khi đăng nhập thành công
      navigate("/dashboard");

      return response;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

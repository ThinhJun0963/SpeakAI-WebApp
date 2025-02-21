import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom"; // Nếu bạn sử dụng react-router

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate(); // Nếu bạn sử dụng react-router

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setLoading(false);
      // Có thể chuyển hướng người dùng sau khi đăng nhập thành công
      // navigate('/dashboard');
      return user;
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.code === "auth/invalid-credential"
          ? "Email hoặc mật khẩu không đúng"
          : err.code === "auth/too-many-requests"
          ? "Quá nhiều lần thử. Vui lòng thử lại sau"
          : "Đã xảy ra lỗi khi đăng nhập";
      setError(errorMessage);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setLoading(false);
      // navigate('/dashboard');
      return user;
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.code === "auth/popup-closed-by-user"
          ? "Đăng nhập đã bị hủy"
          : "Đã xảy ra lỗi khi đăng nhập bằng Google";
      setError(errorMessage);
      throw err;
    }
  };

  return { login, loginWithGoogle, loading, error };
};

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminPage from "./pages/AdminPage";
import DashboardHome from "./pages/DashboardHome";
import CoursePage from "./pages/course/CoursePage";
import CourseDetailPage from "./pages/course/CourseDetailPage";
import CourseEditForm from "./components/course/CourseEditForm";
import AddTopicExercisePage from "./pages/course/AddTopicExercisePage"; // New component
import VoucherPage from "./pages/voucher/VoucherPage";
import CreateVoucherPage from "./pages/voucher/CreateVoucherPage";
import VoucherEditPage from "./pages/voucher/VoucherEditPage";
import TransactionPage from "./pages/transaction/TransactionPage";
import { courseApi, voucherApi } from "./api/axiosInstance";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

const clientId =
  "1018910450198-m8sitc37vcjdg1qbe7d3cp00nca00840.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<AdminPage />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route
              path="/courses/edit/:id"
              element={<CourseEditFormWrapper />}
            />
            <Route path="/courses/:id/details" element={<CourseDetailPage />} />
            <Route
              path="/courses/:id/add-topic-exercise"
              element={<AddTopicExercisePageWrapper />}
            />
            <Route path="/vouchers" element={<VoucherPage />} />
            <Route
              path="/vouchers/create"
              element={
                <CreateVoucherPage
                  onComplete={() => window.history.back()}
                  onCancel={() => window.history.back()}
                />
              }
            />
            <Route
              path="/vouchers/edit/:id"
              element={<VoucherEditFormWrapper />}
            />
            <Route path="/transactions" element={<TransactionPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </GoogleOAuthProvider>
  );
}

const CourseEditFormWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseApi.getDetails(id);
        setCourse(data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };
    fetchCourse();
  }, [id]);

  return (
    <CourseEditForm
      courseId={id}
      visible={true}
      onCancel={() => navigate("/courses")}
      onSuccess={() => navigate("/courses")}
    />
  );
};

const VoucherEditFormWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const data = await voucherApi.getById(id);
        setVoucher(data);
      } catch (error) {
        console.error("Failed to fetch voucher:", error);
      }
    };
    fetchVoucher();
  }, [id]);

  return (
    <VoucherEditPage
      voucher={voucher}
      visible={true}
      onCancel={() => navigate("/vouchers")}
      onSuccess={() => navigate("/vouchers")}
    />
  );
};

const AddTopicExercisePageWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseApi.getDetails(id);
        setCourse(data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };
    fetchCourse();
  }, [id]);

  return (
    <AddTopicExercisePage
      courseId={id}
      course={course}
      onCancel={() => navigate(`/courses/${id}/details`)}
      onSuccess={() => navigate(`/courses/${id}/details`)}
    />
  );
};

export default App;

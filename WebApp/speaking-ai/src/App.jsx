import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import DashboardHome from "./pages/DashboardHome";
import CoursePage from "./pages/course/CoursePage";
import CreateCoursePage from "./pages/course/CreateCoursePage";
import CourseDetailPage from "./pages/course/CourseDetailPage"; // Thêm import mới
import CourseEditForm from "./components/course/CourseEditForm";
import VoucherPage from "./pages/voucher/VoucherPage";
import CreateVoucherPage from "./pages/voucher/CreateVoucherPage";
import VoucherEditForm from "./pages/voucher/VoucherEditForm";
import { courseApi, voucherApi } from "./api/axiosInstance";
import { useState, useEffect } from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AdminPage />}>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route
            path="/courses/create"
            element={
              <CreateCoursePage
                onComplete={() => window.history.back()}
                onCancel={() => window.history.back()}
              />
            }
          />
          <Route path="/courses/edit/:id" element={<CourseEditFormWrapper />} />
          <Route
            path="/courses/:id/details"
            element={<CourseDetailPage />}
          />{" "}
          {/* Route mới */}
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
        </Route>
      </Routes>
    </Router>
  );
}

const CourseEditFormWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseApi.getDetails(id); // Sử dụng getDetails thay vì getById
        setCourse(data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };
    fetchCourse();
  }, [id]);

  return (
    <CourseEditForm
      courseId={id} // Truyền courseId thay vì course object
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
    <VoucherEditForm
      voucher={voucher}
      visible={true}
      onCancel={() => navigate("/vouchers")}
      onSuccess={() => navigate("/vouchers")}
    />
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom"; // Đã có nhưng đảm bảo import đầy đủ
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import DashboardHome from "./pages/DashboardHome";
import CoursePage from "./pages/course/CoursePage";
import CreateCoursePage from "./pages/course/CreateCoursePage";
import CourseEditForm from "./components/course/CourseEditForm";
import { courseApi } from "./api/axiosInstance"; // Thêm import courseApi
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
        const data = await courseApi.getById(id); // Sử dụng courseApi đã import
        setCourse(data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };
    fetchCourse();
  }, [id]);

  return (
    <CourseEditForm
      course={course}
      visible={true}
      onCancel={() => navigate("/courses")}
      onSuccess={() => navigate("/courses")}
    />
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import DashboardHome from "./pages/DashboardHome";
import CoursePage from "./pages/course/CoursePage";
import CreateCoursePage from "./pages/course/CreateCoursePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AdminPage />}>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/courses" element={<CoursePage />} />
          <Route path="/courses/create" element={<CreateCoursePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import DashboardHome from "./pages/DashboardHome";
import CoursePage from "./pages/course/CoursePage";
// import BookingsPage from "./pages/BookingsPage";
// import PaymentsPage from "./pages/PaymentsPage";
// import ReportsPage from "./pages/ReportsPage";
// import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AdminPage />}>
          <Route index element={<DashboardHome />} />
          <Route path="/courses" element={<CoursePage />} />
          {/* <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route }
    from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobsPage from "./pages/JobsPage";
import MyApplicationsPage
    from "./pages/MyApplicationsPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import NotificationToast from "./components/NotificationToast";

function App() {
    return (
        <BrowserRouter>
            <NotificationToast />
            <Routes>
                <Route path="/"
                    element={<LoginPage />} />
                <Route path="/login"
                    element={<LoginPage />} />
                <Route path="/register"
                    element={<RegisterPage />} />
                <Route path="/jobs"
                    element={<JobsPage />} />
                <Route path="/my-applications"
                    element={<MyApplicationsPage />} />
                <Route path="/admin"
                    element={<AdminDashboard />} />
                <Route path="/employer"
                    element={<EmployerDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
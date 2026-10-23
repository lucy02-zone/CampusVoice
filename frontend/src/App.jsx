import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Notifications from "./pages/Notifications";
import ReportPost from "./pages/ReportPost";
import AdminReports from "./pages/AdminReports";
import AdminComplaintResponses from "./pages/AdminComplaintResponses";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import CreateComplaint from "./pages/CreateComplaint";
import AdminComplaints from "./pages/AdminComplaints";
import AdminMentors from "./pages/AdminMentors";
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login adminOnly />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedRoute requiredRole={["STUDENT", "MENTOR"]}><Dashboard /></ProtectedRoute>} />
        <Route path="/posts" element={<ProtectedRoute requiredRole={["STUDENT", "MENTOR"]}><Posts /></ProtectedRoute>} />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute requiredRole={["STUDENT", "MENTOR"]}>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route path="/complaints/new" element={<ProtectedRoute requiredRole={["STUDENT", "MENTOR"]}><CreateComplaint /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute requiredRole={["STUDENT", "MENTOR"]}><PostDetail /></ProtectedRoute>} />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute requiredRole={["STUDENT", "MENTOR"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute requiredRole={["STUDENT", "MENTOR"]}>
              <ReportPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/complaints" element={<ProtectedRoute requiredRole="ADMIN"><AdminComplaints /></ProtectedRoute>} />
        <Route path="/admin/mentors" element={<ProtectedRoute requiredRole="ADMIN"><AdminMentors /></ProtectedRoute>} />
        <Route
          path="/admin/complaint-responses"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminComplaintResponses />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

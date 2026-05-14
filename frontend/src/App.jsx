import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Map from "./pages/Map";
import Feed from "./pages/Feed";
import ReportsList from "./pages/ReportsList";
import ReportDetail from "./pages/ReportDetail";
import CreateReport from "./pages/CreateReport";
import Dashboard from './pages/Dashboard';
import ReportsModeration from './pages/admin/ReportsModeration';
import UsersManagement from './pages/admin/UsersManagement';
import PostsModeration from './pages/admin/PostsModeration';
import CriticalZones from './pages/admin/CriticalZones';
// ... autres imports (Map, Feed, etc.)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<MainLayout />}>
          {/* Routes admin */}
            <Route path="dashboard" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
            <Route path="dashboard/reports" element={<ProtectedRoute requireAdmin><ReportsModeration /></ProtectedRoute>} />
            <Route path="dashboard/users" element={<ProtectedRoute requireAdmin><UsersManagement /></ProtectedRoute>} />
            <Route path="dashboard/posts" element={<ProtectedRoute requireAdmin><PostsModeration /></ProtectedRoute>} />
            <Route path="dashboard/critical-zones" element={<ProtectedRoute requireAdmin><CriticalZones /></ProtectedRoute>} />
            <Route index element={<Home />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <div>Profil</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <div>Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="map" element={<Map />} />
            <Route path="feed" element={<Feed />} />
            <Route path="reports" element={<ReportsList />} />
            <Route path="reports/:id" element={<ReportDetail />} />
            <Route
              path="create-report"
              element={
                <ProtectedRoute>
                  <CreateReport />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

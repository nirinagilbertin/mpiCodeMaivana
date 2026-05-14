import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// ... autres imports (Map, Feed, etc.)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="map" element={<div>Carte (à venir)</div>} />
            <Route path="feed" element={<div>Fil d’actu (à venir)</div>} />
            <Route path="reports" element={<div>Signalements (à venir)</div>} />
            <Route path="profile" element={<ProtectedRoute><div>Profil</div></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute requireAdmin><div>Dashboard</div></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
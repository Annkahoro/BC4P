import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import ContributorLogin from './pages/ContributorLogin';
import AdminLogin from './pages/AdminLogin';
import ContributorDashboard from './pages/ContributorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminSubmissionReview from './pages/AdminSubmissionReview';
import AdminUserList from './pages/AdminUserList';
import AdminSubmissionList from './pages/AdminSubmissionList';
import SubmissionWorkspace from './pages/SubmissionWorkspace';
import Navbar from './components/Navbar';

function App() {
  const { userInfo } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar userInfo={userInfo} />
      <main className="flex-grow overflow-hidden">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<ContributorLogin />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Contributor Routes */}
          <Route 
            path="/dashboard" 
            element={userInfo && userInfo.role === 'Contributor' ? <ContributorDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/submit/:pillar" 
            element={userInfo && userInfo.role === 'Contributor' ? <SubmissionWorkspace /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/admin/dashboard" 
            element={userInfo && (userInfo.role === 'Admin' || userInfo.role === 'Super Admin') ? <AdminDashboard /> : <Navigate to="/admin" />} 
          />
          <Route 
            path="/admin/submissions" 
            element={userInfo && (userInfo.role === 'Admin' || userInfo.role === 'Super Admin') ? <AdminSubmissionList /> : <Navigate to="/admin" />} 
          />
          <Route 
            path="/admin/submissions/:id" 
            element={userInfo && (userInfo.role === 'Admin' || userInfo.role === 'Super Admin') ? <AdminSubmissionReview /> : <Navigate to="/admin" />} 
          />
          <Route 
            path="/admin/users" 
            element={userInfo && (userInfo.role === 'Admin' || userInfo.role === 'Super Admin') ? <AdminUserList /> : <Navigate to="/admin" />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

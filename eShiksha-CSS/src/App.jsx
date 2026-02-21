import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context + Floating Button
import { LanguageProvider } from './context/LanguageContext';
import LanguageFloatingBtn from './components/LanguageFloatingBtn';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';

// ✅ Parent Dashboard Import
import ParentDashboard from './pages/parent/ParentDashboard';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>

        {/* 🔥 Glow Orb Background Effect */}
        <div className="glow-orb"></div>

        {/* Floating Language Button */}
        <LanguageFloatingBtn />

        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          

          {/* Role Dashboards */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

          {/* Parent Dashboard */}
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
        </Routes>

      </BrowserRouter>
    </LanguageProvider>
  );
}

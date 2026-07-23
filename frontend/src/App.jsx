import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';

import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Snackbar } from './components/common/Snackbar';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ClassroomDetail } from './pages/ClassroomDetail';
import { AssignmentDetail } from './pages/AssignmentDetail';
import { LiveMeetingRoom } from './pages/LiveMeetingRoom';
import { ChatPage } from './pages/ChatPage';
import { CalendarPage } from './pages/CalendarPage';
import { GeminiPage } from './pages/GeminiPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';

import { Sparkles } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-layout">
        <Sidebar isOpen={sidebarOpen} />
        <main className="content-body">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/classroom/:id" element={<ClassroomDetail />} />
            <Route path="/assignment/:id" element={<AssignmentDetail />} />
            <Route path="/meeting/:id" element={<LiveMeetingRoom />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/gemini" element={<GeminiPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating Gemini Assistant Button */}
      <button className="fab-gemini" onClick={() => navigate('/gemini')} title="Ask Gemini AI Assistant">
        <Sparkles size={20} />
        <span>Ask Gemini</span>
      </button>

      <Snackbar />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <SocketProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </SocketProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, BookOpen, Calendar, MessageSquare, Video, Sparkles, Shield, Settings } from 'lucide-react';

export const Sidebar = ({ isOpen }) => {
  const { user } = useContext(AuthContext);

  if (!isOpen) return null;

  return (
    <aside className="material-sidebar">
      <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/calendar" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <Calendar size={20} />
        <span>Calendar</span>
      </NavLink>

      <NavLink to="/chat" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <MessageSquare size={20} />
        <span>Messages</span>
      </NavLink>

      <NavLink to="/gemini" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <Sparkles size={20} color="#a142f4" />
        <span>Gemini AI</span>
      </NavLink>

      {user?.role === 'ADMIN' && (
        <NavLink to="/admin" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Shield size={20} />
          <span>Admin Console</span>
        </NavLink>
      )}

      <div style={{ margin: '16px 0 8px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        Account
      </div>

      <NavLink to="/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
        <Settings size={20} />
        <span>Settings</span>
      </NavLink>
    </aside>
  );
};

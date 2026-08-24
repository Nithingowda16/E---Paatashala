import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { NotificationContext } from '../../context/NotificationContext';
import { Bell, Moon, Sun, Search, LogOut, User as UserIcon, Shield, Sparkles } from 'lucide-react';

import { Logo } from './Logo';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { notifications, unreadCount, markAllAsRead } = useContext(NotificationContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="material-navbar">
      <div className="nav-brand">
        <button className="icon-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', textDecoration: 'none' }}>
          <Logo size={34} />
        </Link>
      </div>

      <div className="nav-search">
        <Search size={18} className="text-sub" />
        <input type="text" placeholder="Search classrooms, assignments, materials..." />
      </div>

      <div className="nav-actions">
        {/* Gemini Quick Access */}
        <button className="btn btn-outline" onClick={() => navigate('/gemini')} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
          <Sparkles size={16} color="#a142f4" />
          <span>Ask Gemini</span>
        </button>

        {/* Theme Toggle */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="badge-dot">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="material-card" style={{ position: 'absolute', right: 0, top: '48px', width: '340px', zIndex: 200, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0 }}>Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => {
                        if (n.link) navigate(n.link);
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: n.isRead ? 'transparent' : 'var(--primary-container)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{n.title}</div>
                      <div style={{ color: 'var(--text-sub)', marginTop: '2px' }}>{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Menu */}
        <div style={{ position: 'relative' }}>
          <div className="user-profile-badge" onClick={() => setShowMenu(!showMenu)}>
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} className="user-avatar" alt={user.name} />
            ) : (
              <div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            )}
          </div>

          {showMenu && (
            <div className="material-card" style={{ position: 'absolute', right: 0, top: '48px', width: '220px', zIndex: 200, padding: '12px' }}>
              <div style={{ paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{user?.email}</div>
                <span className="chip chip-info" style={{ marginTop: '6px' }}>
                  {user?.role}
                </span>
              </div>
              <button
                className="sidebar-item"
                onClick={() => {
                  navigate('/settings');
                  setShowMenu(false);
                }}
                style={{ width: '100%', border: 'none', padding: '8px 12px' }}
              >
                <UserIcon size={16} /> Profile & Settings
              </button>
              {user?.role === 'ADMIN' && (
                <button
                  className="sidebar-item"
                  onClick={() => {
                    navigate('/admin');
                    setShowMenu(false);
                  }}
                  style={{ width: '100%', border: 'none', padding: '8px 12px' }}
                >
                  <Shield size={16} /> Admin Console
                </button>
              )}
              <button
                className="sidebar-item"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                style={{ width: '100%', border: 'none', padding: '8px 12px', color: 'var(--danger)' }}
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

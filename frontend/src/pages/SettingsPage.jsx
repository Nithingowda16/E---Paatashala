import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import { User, Sun, Moon, Save } from 'lucide-react';

export const SettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { showToast } = useContext(NotificationContext);

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { name, department, profilePhoto });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('lms_user', JSON.stringify(res.data.user));
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast('Profile update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
      <div className="material-card">
        <h2 style={{ marginBottom: '16px' }}>Account Settings</h2>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Profile Photo Image URL</label>
            <input
              type="text"
              value={profilePhoto}
              onChange={(e) => setProfilePhoto(e.target.value)}
              placeholder="https://..."
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: 'fit-content', marginTop: '8px' }}>
            <Save size={16} /> {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      <div className="material-card">
        <h3 style={{ marginBottom: '12px' }}>Theme Preferences</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Appearance Mode</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Current Theme: {theme.toUpperCase()}</div>
          </div>
          <button className="btn btn-secondary" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Toggle Theme
          </button>
        </div>
      </div>
    </div>
  );
};

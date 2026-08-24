import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import { Logo } from '../components/common/Logo';
import { LogIn, Sun, Moon, ArrowLeft, ShieldAlert } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { showToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  const isUnauthorizedDomain = email.length > 3 && !email.toLowerCase().trim().endsWith('@nxtwave.in');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.toLowerCase().trim().endsWith('@nxtwave.in')) {
      showToast('Access Restricted: Only authorized NxtWave students and mentors are allowed to access this portal.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data);
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Access Restricted: Invalid credentials or unauthorized email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)', padding: '16px', position: 'relative' }}>
      {/* Top Header Buttons */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="icon-btn" onClick={() => navigate('/')} title="Back to Home">
          <ArrowLeft size={20} />
        </button>

        {/* Theme Toggle Button */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {theme === 'dark' ? <Sun size={22} color="#fbbc04" /> : <Moon size={22} color="#5f6368" />}
        </button>
      </div>

      <div className="material-card" style={{ width: '100%', maxWidth: '420px', padding: '36px 28px', marginTop: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo size={48} showOnlineBadge={false} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '12px' }}>Sign in to NxtWave Online</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: '4px' }}>Use your official @nxtwave.in account to access portal</p>
        </div>

        {/* Access Restricted Warning Alert */}
        {isUnauthorizedDomain && (
          <div className="chip chip-danger" style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: 'var(--radius-sm)', width: '100%', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>Access Restricted: Only authorized @nxtwave.in accounts are permitted.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. shraddha@nxtwave.in"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

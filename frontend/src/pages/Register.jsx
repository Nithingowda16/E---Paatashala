import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import { Logo } from '../components/common/Logo';
import { UserPlus, Sun, Moon, ArrowLeft } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { showToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, role, studentId, department });
      if (res.data.success) {
        login(res.data);
        showToast('Account created successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
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

      <div className="material-card" style={{ width: '100%', maxWidth: '460px', padding: '32px 28px', marginTop: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo size={44} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '8px' }}>Create Your LMS Account</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>Join E Paatashala platform</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Ananya Sharma"
            />
          </div>

          <div>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. ananya@school.edu"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label>Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>

          {role === 'STUDENT' && (
            <div>
              <label>Student ID Number</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. CS2026-001"
              />
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            <UserPlus size={18} /> {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Logo } from '../components/common/Logo';
import { Sun, Moon, LogIn, UserPlus, Sparkles, BookOpen, Video, CheckCircle, MessageSquare, Shield, ArrowRight } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header style={{ height: '70px', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', sticky: 'top', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.3rem', fontWeight: 700 }}>
          <Logo size={38} />
          <span>E Paatashala</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Toggle Button */}
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? <Sun size={22} color="#fbbc04" /> : <Moon size={22} color="#5f6368" />}
          </button>

          <button className="btn btn-secondary" onClick={() => navigate('/login')}>
            <LogIn size={18} /> Sign In
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            <UserPlus size={18} /> Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div className="chip chip-info" style={{ marginBottom: '20px', padding: '6px 16px', fontSize: '0.9rem' }}>
          <Sparkles size={16} color="#a142f4" /> AI-Powered Education Platform
        </div>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.5px' }}>
          Empower Teaching & Learning with <span style={{ color: 'var(--primary)' }}>Smart AI Integration</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-sub)', marginTop: '20px', maxWidth: '760px', margin: '20px auto 36px' }}>
          An all-in-one virtual classroom platform. Manage stream updates, notes, assignments, grading, WebRTC live classes, real-time chat, and automated attendance with built-in Gemini AI assistance.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ padding: '14px 32px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #1a73e8 0%, #174ea6 100%)' }}>
            Enter Classroom <ArrowRight size={20} />
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/register')} style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
            Create Account
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '40px' }}>
          Everything You Need in One Unified Hub
        </h2>

        <div className="grid-3">
          <div className="material-card" style={{ padding: '28px' }}>
            <BookOpen size={36} color="#1a73e8" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Classrooms & Streams</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
              Publish announcements, share syllabus notes, and manage assignments with automatic deadline reminders.
            </p>
          </div>

          <div className="material-card" style={{ padding: '28px' }}>
            <Video size={36} color="#ea4335" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>WebRTC Live Classes</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
              Host integrated video classes with screen sharing, raise hand controls, and automated meeting participation attendance.
            </p>
          </div>

          <div className="material-card" style={{ padding: '28px' }}>
            <Sparkles size={36} color="#a142f4" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Gemini AI Assistant</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
              Summarize study notes, generate practice quizzes, craft revision schedules, and draft lesson plans instantly.
            </p>
          </div>

          <div className="material-card" style={{ padding: '28px' }}>
            <CheckCircle size={36} color="#34a853" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Smart Attendance Engine</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
              Authoritative server timestamp window validation, percentage analytics, and low-attendance alert warnings.
            </p>
          </div>

          <div className="material-card" style={{ padding: '28px' }}>
            <MessageSquare size={36} color="#fbbc04" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Real-Time Messaging</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
              Classroom group channels and direct 1-on-1 teacher-student messaging powered by Socket.IO.
            </p>
          </div>

          <div className="material-card" style={{ padding: '28px' }}>
            <Shield size={36} color="#1a73e8" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Role Security & Admin</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>
              Strict role-based access control, gradebook matrices, storage analytics, and administrative audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', padding: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-sub)' }}>
        © 2026 E Paatashala Platform. Inspired by Google Material Design. All rights reserved.
      </footer>
    </div>
  );
};

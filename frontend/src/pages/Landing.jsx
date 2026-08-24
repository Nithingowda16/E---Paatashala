import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Logo } from '../components/common/Logo';
import { Sun, Moon, LogIn, UserPlus, Sparkles, BookOpen, Video, CheckCircle, MessageSquare, Shield, ArrowRight } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {/* Apple Translucent Glass Header */}
      <header className="material-navbar">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size={36} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Toggle Button */}
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Light/Dark Mode">
            {theme === 'dark' ? <Sun size={20} color="#FF9500" /> : <Moon size={20} color="#86868b" />}
          </button>

          <button className="btn btn-secondary" onClick={() => navigate('/login')} style={{ borderRadius: '9999px', padding: '9px 20px', fontSize: '0.9rem' }}>
            <LogIn size={16} /> Sign In
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/register')} style={{ borderRadius: '9999px', padding: '9px 22px', fontSize: '0.9rem' }}>
            <UserPlus size={16} /> Get Started
          </button>
        </div>
      </header>

      {/* Hero Section with Apple Ambient Glow */}
      <section style={{ 
        padding: '100px 24px 80px', 
        textAlign: 'center', 
        maxWidth: '1020px', 
        margin: '0 auto', 
        width: '100%',
        position: 'relative',
      }}>
        {/* Apple Ambient Mesh Lighting */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 122, 255, 0.12) 0%, rgba(175, 82, 222, 0.08) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="apple-chip" style={{ marginBottom: '24px', padding: '7px 18px' }}>
            <Sparkles size={15} color="#007AFF" /> 
            <span>AI-POWERED CLASSROOM PLATFORM</span>
          </div>

          <h1 style={{ 
            fontSize: '3.6rem', 
            fontWeight: 800, 
            lineHeight: 1.15, 
            letterSpacing: '-0.035em',
            margin: '0 auto',
            maxWidth: '900px',
          }}>
            Empower Teaching & Learning with <span className="apple-gradient-text">Smart AI Integration</span>
          </h1>

          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-sub)', 
            marginTop: '24px', 
            maxWidth: '720px', 
            margin: '24px auto 40px',
            lineHeight: 1.5,
            fontWeight: 400,
          }}>
            An all-in-one virtual classroom platform. Stream announcements, syllabus notes, assignments, grading, WebRTC live classes, real-time chat, and automated attendance with built-in Gemini AI.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/login')} 
              style={{ 
                padding: '14px 34px', 
                fontSize: '1.05rem', 
                borderRadius: '9999px',
                background: '#007AFF',
                boxShadow: 'none',
              }}
            >
              Enter Classroom <ArrowRight size={18} />
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/register')} 
              style={{ 
                padding: '14px 30px', 
                fontSize: '1.05rem',
                borderRadius: '9999px',
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Apple Product Features Grid */}
      <section style={{ padding: '60px 24px 100px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Everything You Need in One Unified Hub
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '1.1rem' }}>
            Designed for teachers, students, and administrators with Human Interface precision.
          </p>
        </div>

        <div className="grid-3">
          <div className="apple-card">
            <div className="apple-icon-box apple-icon-blue">
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>Classrooms & Streams</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Publish announcements, share syllabus notes, and manage assignments with automatic deadline reminders.
            </p>
          </div>

          <div className="apple-card">
            <div className="apple-icon-box apple-icon-red">
              <Video size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>WebRTC Live Classes</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Host integrated video classes with screen sharing, raise hand controls, and automated meeting participation attendance.
            </p>
          </div>

          <div className="apple-card">
            <div className="apple-icon-box apple-icon-purple">
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>Gemini AI Assistant</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Summarize study notes, generate practice quizzes, craft revision schedules, and draft lesson plans instantly.
            </p>
          </div>

          <div className="apple-card">
            <div className="apple-icon-box apple-icon-green">
              <CheckCircle size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>Smart Attendance Engine</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Authoritative server timestamp window validation, percentage analytics, and low-attendance alert warnings.
            </p>
          </div>

          <div className="apple-card">
            <div className="apple-icon-box apple-icon-yellow">
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>Real-Time Messaging</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Classroom group channels and direct 1-on-1 teacher-student messaging powered by Socket.IO.
            </p>
          </div>

          <div className="apple-card">
            <div className="apple-icon-box apple-icon-blue">
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>Role Security & Admin</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Strict role-based access control, gradebook matrices, storage analytics, and administrative audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* Apple Footer */}
      <footer style={{ 
        marginTop: 'auto', 
        borderTop: '1px solid var(--border-color)', 
        padding: '32px 24px', 
        textAlign: 'center', 
        fontSize: '0.85rem', 
        color: 'var(--text-sub)',
        backgroundColor: 'var(--bg-card)',
      }}>
        © 2026 NxtWave Online Platform. All rights reserved.
      </footer>
    </div>
  );
};

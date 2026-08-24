import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { Plus, UserPlus, BookOpen, Clock, Calendar, CheckCircle, AlertTriangle, Video, Sparkles, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [classrooms, setClassrooms] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Form states
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newSection, setNewSection] = useState('A');
  const [joinCode, setJoinCode] = useState('');

  const fetchClassrooms = async () => {
    try {
      const res = await api.get('/classrooms');
      if (res.data.success) {
        setClassrooms(res.data.classrooms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/auth/students');
      if (res.data.success) {
        setAvailableStudents(res.data.students);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClassrooms();
    if (user?.role === 'TEACHER' || user?.role === 'ADMIN') {
      fetchStudents();
    }
  }, [user]);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/classrooms', {
        name: newClassName,
        subject: newSubject,
        section: newSection,
        studentIds: selectedStudentIds,
      });
      if (res.data.success) {
        showToast(`Classroom '${newClassName}' created & student notification sent!`, 'success');
        setShowCreateModal(false);
        setNewClassName('');
        setNewSubject('');
        setSelectedStudentIds([]);
        fetchClassrooms();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Create failed', 'error');
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/classrooms/join', { classCode: joinCode });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setShowJoinModal(false);
        setJoinCode('');
        fetchClassrooms();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Join failed', 'error');
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Greeting Banner */}
      <div className="material-card" style={{ background: 'linear-gradient(135deg, #007AFF 0%, #004085 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, margin: 0, color: 'white' }}>
              {getTimeGreeting()}, {user?.name}! 👋
            </h2>
            <p style={{ opacity: 0.9, marginTop: '4px', fontSize: '0.95rem' }}>
              {user?.role === 'TEACHER' ? 'Manage your classrooms, assign students, and track live progress.' : 'Track your assigned classrooms, upcoming deadlines, and study notes.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {user?.role === 'TEACHER' || user?.role === 'ADMIN' ? (
              <button className="btn" onClick={() => setShowCreateModal(true)} style={{ backgroundColor: 'white', color: '#007AFF' }}>
                <Plus size={18} /> Create Classroom & Assign Student
              </button>
            ) : (
              <button className="btn" onClick={() => setShowJoinModal(true)} style={{ backgroundColor: 'white', color: '#007AFF' }}>
                <UserPlus size={18} /> Join with Code
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Student Priority Engine / Summary Cards */}
      <div className="grid-4">
        <div className="material-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sub" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Enrolled Classes</span>
            <BookOpen size={20} color="#007AFF" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>{classrooms.length}</div>
        </div>

        <div className="material-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sub" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Live Sessions</span>
            <Video size={20} color="#AF52DE" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>Active</div>
        </div>

        <div className="material-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sub" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Attendance Rate</span>
            <CheckCircle size={20} color="#34C759" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px', color: '#34C759' }}>95%</div>
        </div>

        <div className="material-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sub" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Gemini AI Ready</span>
            <Sparkles size={20} color="#FF9500" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px', color: '#FF9500' }}>Enabled</div>
        </div>
      </div>

      {/* Classrooms Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600, margin: 0 }}>Your NxtWave Classrooms</h3>
        </div>

        {loading ? (
          <SkeletonLoader count={3} type="card" />
        ) : classrooms.length === 0 ? (
          <EmptyState
            title="No Classrooms Available"
            message={user?.role === 'TEACHER' ? 'Click "Create Classroom & Assign Student" to set up a new class.' : 'You have not been assigned to any classrooms yet.'}
            icon="school"
          />
        ) : (
          <div className="grid-3">
            {classrooms.map((cls) => (
              <div
                key={cls._id}
                className="apple-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                onClick={() => navigate(`/classroom/${cls._id}`)}
              >
                <div className={`class-banner ${cls.coverBanner || 'gradient-blue'}`} style={{ height: '140px' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.9 }}>{cls.subject}</div>
                  <h1>{cls.name}</h1>
                  <div className="class-code-badge">{cls.classCode}</div>
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                    Instructor: {cls.teacher?.name || 'Mentor'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <span className="chip chip-info">{cls.myRole || user?.role}</span>
                    <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
                      Enter Class
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create Classroom & Select Student */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Classroom & Assign Student">
        <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Classroom Name *</label>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              required
              placeholder="e.g. Full Stack React & AI - Batch 1"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Subject Track *</label>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              required
              placeholder="e.g. MERN & GenAI"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Section / Batch</label>
            <input
              type="text"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="e.g. Batch 2026-A"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
            />
          </div>

          {/* Student Selection for Classroom Assignment */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Select Student(s) to Assign & Send Notification *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px', backgroundColor: 'var(--bg-page)' }}>
              {availableStudents.length === 0 ? (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>No active students available.</span>
              ) : (
                availableStudents.map((st) => (
                  <label key={st._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}>
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(st._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudentIds([...selectedStudentIds, st._id]);
                        } else {
                          setSelectedStudentIds(selectedStudentIds.filter((id) => id !== st._id));
                        }
                      }}
                    />
                    <span style={{ fontWeight: 500 }}>{st.name}</span>
                    <span style={{ color: 'var(--text-sub)', fontSize: '0.8rem' }}>({st.email})</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ marginTop: '8px' }}>
            <Plus size={16} /> Create Classroom & Notify Student
          </button>
        </form>
      </Modal>

      {/* Modal: Join Classroom */}
      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join Classroom with Code">
        <form onSubmit={handleJoinClass} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Classroom Code *</label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              required
              placeholder="e.g. NXT-AI-2026"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', textTransform: 'uppercase' }}
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{ marginTop: '8px' }}>
            Join Classroom
          </button>
        </form>
      </Modal>
    </div>
  );
};

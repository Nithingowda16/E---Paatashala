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

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/classrooms', { name: newClassName, subject: newSubject, section: newSection });
      if (res.data.success) {
        showToast(`Classroom '${newClassName}' created!`, 'success');
        setShowCreateModal(false);
        setNewClassName('');
        setNewSubject('');
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
      <div className="material-card" style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #174ea6 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, margin: 0 }}>
              {getTimeGreeting()}, {user?.name}! 👋
            </h2>
            <p style={{ opacity: 0.9, marginTop: '4px', fontSize: '0.95rem' }}>
              {user?.role === 'TEACHER' ? 'Manage your classrooms, assignments, and live classes.' : 'Track your upcoming deadlines, attendance, and study materials.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {user?.role === 'TEACHER' ? (
              <button className="btn" onClick={() => setShowCreateModal(true)} style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
                <Plus size={18} /> Create Classroom
              </button>
            ) : (
              <button className="btn" onClick={() => setShowJoinModal(true)} style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
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
            <BookOpen size={20} color="#1a73e8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px' }}>{classrooms.length}</div>
        </div>

        <div className="material-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sub" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Attendance Percentage</span>
            <CheckCircle size={20} color="#34a853" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px', color: '#34a853' }}>92%</div>
        </div>

        <div className="material-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sub" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Pending Assignments</span>
            <Clock size={20} color="#fbbc04" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px', color: '#fbbc04' }}>1</div>
        </div>

        <div className="material-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-sub" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Live Classes Today</span>
            <Video size={20} color="#ea4335" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '8px', color: '#ea4335' }}>1</div>
        </div>
      </div>

      {/* Classroom Cards Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>My Classrooms</h3>
          {user?.role === 'TEACHER' && (
            <button className="btn btn-secondary" onClick={() => setShowJoinModal(true)}>
              <UserPlus size={16} /> Join Class
            </button>
          )}
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : classrooms.length === 0 ? (
          <EmptyState
            title="No Classrooms Yet"
            message={user?.role === 'TEACHER' ? "You haven't created any classroom yet. Click below to create your first class!" : "You aren't enrolled in any classroom. Ask your teacher for a class code to join!"}
            icon="school"
            actionText={user?.role === 'TEACHER' ? 'Create Classroom' : 'Join Classroom'}
            onAction={() => (user?.role === 'TEACHER' ? setShowCreateModal(true) : setShowJoinModal(true))}
          />
        ) : (
          <div className="grid-3">
            {classrooms.map((cls) => (
              <div
                key={cls._id}
                className="material-card"
                onClick={() => navigate(`/classroom/${cls._id}`)}
                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                <div className={`class-banner ${cls.coverBanner || 'gradient-blue'}`} style={{ height: '120px', borderRadius: 0, margin: 0 }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{cls.name}</h3>
                  <p style={{ fontSize: '0.85rem' }}>{cls.subject} • Section {cls.section}</p>
                  <div className="class-code-badge">{cls.classCode}</div>
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                    Instructor: {cls.teacher?.name || 'Faculty Member'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <span className="chip chip-info">{cls.myRole || user?.role}</span>
                    <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                      Open Class
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create Classroom */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Classroom">
        <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Classroom Name *</label>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              required
              placeholder="e.g. Artificial Intelligence & Machine Learning"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Subject *</label>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              required
              placeholder="e.g. AI & ML CS-401"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Section</label>
            <input
              type="text"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="e.g. Section A"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{ marginTop: '8px' }}>
            Create Classroom
          </button>
        </form>
      </Modal>

      {/* Modal: Join Classroom */}
      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join Classroom">
        <form onSubmit={handleJoinClass} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
            Ask your teacher for the class code, then enter it here.
          </p>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Classroom Code *</label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
              placeholder="e.g. CS-AI-7X92"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', letterSpacing: '1px', fontWeight: 600 }}
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{ marginTop: '8px' }}>
            Join Class
          </button>
        </form>
      </Modal>
    </div>
  );
};

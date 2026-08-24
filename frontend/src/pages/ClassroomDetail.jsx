import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

import {
  MessageSquare,
  BookOpen,
  Users,
  CheckSquare,
  Video,
  FileText,
  Sparkles,
  Send,
  Plus,
  Upload,
  Clock,
  Award,
  Play,
} from 'lucide-react';

export const ClassroomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');

  // Stream state
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  // Classwork state
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Attendance state
  const [attendanceData, setAttendanceData] = useState(null);

  // Meetings state
  const [meetings, setMeetings] = useState([]);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // People state
  const [roster, setRoster] = useState({ teachers: [], students: [] });

  // Gradebook state
  const [gradebook, setGradebook] = useState(null);

  // Gemini state
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [geminiReply, setGeminiReply] = useState('');
  const [geminiLoading, setGeminiLoading] = useState(false);

  // Modals
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Modal forms
  const [matTitle, setMatTitle] = useState('');
  const [matDesc, setMatDesc] = useState('');
  const [matTopic, setMatTopic] = useState('Unit 1 – Intro');

  const [assTitle, setAssTitle] = useState('');
  const [assDesc, setAssDesc] = useState('');
  const [assDueDate, setAssDueDate] = useState('');
  const [assMaxMarks, setAssMaxMarks] = useState(20);

  const [meetTitle, setMeetTitle] = useState('');
  const [meetTime, setMeetTime] = useState('');

  const fetchClassroomDetails = async () => {
    try {
      const res = await api.get(`/classrooms/${id}`);
      if (res.data.success) {
        setClassroom(res.data.classroom);
      }
    } catch (err) {
      showToast('Error loading classroom', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStream = async () => {
    try {
      const res = await api.get(`/stream/${id}/announcements`);
      if (res.data.success) setAnnouncements(res.data.announcements);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await api.get(`/materials/${id}`);
      if (res.data.success) setMaterials(res.data.materials);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get(`/assignments/classroom/${id}`);
      if (res.data.success) setAssignments(res.data.assignments);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/classroom/${id}`);
      if (res.data.success) setAttendanceData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await api.get(`/meetings/classroom/${id}`);
      if (res.data.success) setMeetings(res.data.meetings);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChat = async () => {
    try {
      const res = await api.get(`/chat/classroom/${id}`);
      if (res.data.success) setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoster = async () => {
    try {
      const res = await api.get(`/classrooms/${id}/members`);
      if (res.data.success) setRoster(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGradebook = async () => {
    try {
      const res = await api.get(`/assignments/gradebook/${id}`);
      if (res.data.success) setGradebook(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClassroomDetails();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'stream') fetchStream();
    if (activeTab === 'classwork') {
      fetchMaterials();
      fetchAssignments();
    }
    if (activeTab === 'people') fetchRoster();
    if (activeTab === 'attendance') fetchAttendance();
    if (activeTab === 'meetings') fetchMeetings();
    if (activeTab === 'chat') fetchChat();
    if (activeTab === 'grades') fetchGradebook();
  }, [activeTab, id]);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/stream/${id}/announcements`, { content: newAnnouncement });
      if (res.data.success) {
        showToast('Announcement posted to stream!', 'success');
        setNewAnnouncement('');
        setShowAnnouncementModal(false);
        fetchStream();
      }
    } catch (err) {
      showToast('Failed to post announcement', 'error');
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/materials/${id}`, { title: matTitle, description: matDesc, topic: matTopic });
      if (res.data.success) {
        showToast('Study material posted!', 'success');
        setShowMaterialModal(false);
        setMatTitle('');
        setMatDesc('');
        fetchMaterials();
      }
    } catch (err) {
      showToast('Failed to post material', 'error');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/assignments/${id}`, { title: assTitle, description: assDesc, dueDate: assDueDate, maxMarks: assMaxMarks });
      if (res.data.success) {
        showToast('Assignment created!', 'success');
        setShowAssignmentModal(false);
        setAssTitle('');
        setAssDesc('');
        fetchAssignments();
      }
    } catch (err) {
      showToast('Failed to create assignment', 'error');
    }
  };

  const handleStartAttendanceSession = async () => {
    try {
      const res = await api.post('/attendance/sessions', { classroomId: id, windowMinutes: 15 });
      if (res.data.success) {
        showToast('Attendance session opened for 15 minutes!', 'success');
        fetchAttendance();
      }
    } catch (err) {
      showToast('Failed to start attendance', 'error');
    }
  };

  const handleMarkPresent = async (session) => {
    try {
      const res = await api.post('/attendance/mark', { sessionId: session._id, sessionToken: session.sessionToken });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchAttendance();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Attendance error', 'error');
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/meetings', { classroomId: id, title: meetTitle, scheduledStartTime: meetTime });
      if (res.data.success) {
        showToast('Live WebRTC class scheduled!', 'success');
        setShowMeetingModal(false);
        setMeetTitle('');
        fetchMeetings();
      }
    } catch (err) {
      showToast('Failed to schedule meeting', 'error');
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    try {
      const res = await api.post('/chat/send', { classroomId: id, content: chatInput });
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setChatInput('');
      }
    } catch (err) {
      showToast('Message send failed', 'error');
    }
  };

  const handleAskGemini = async (e) => {
    e.preventDefault();
    if (!geminiPrompt.trim()) return;
    setGeminiLoading(true);
    try {
      const context = `Classroom: ${classroom.name}. Subject: ${classroom.subject}. Description: ${classroom.description}`;
      const res = await api.post('/gemini/chat', { prompt: geminiPrompt, contextData: context });
      if (res.data.success) {
        setGeminiReply(res.data.reply);
      }
    } catch (err) {
      showToast('Gemini query error', 'error');
    } finally {
      setGeminiLoading(false);
    }
  };

  if (loading) return <SkeletonLoader count={4} />;
  if (!classroom) return <EmptyState title="Classroom Not Found" message="This classroom may have been removed or archived." icon="error" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Classroom Banner */}
      <div className={`class-banner ${classroom.coverBanner || 'gradient-blue'}`}>
        <h1>{classroom.name}</h1>
        <p>{classroom.subject} • Section {classroom.section} • Room {classroom.room}</p>
        <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>Instructor: {classroom.teacher?.name}</div>
        <div className="class-code-badge">Class Code: {classroom.classCode}</div>
      </div>

      {/* Material Tabs Bar */}
      <div className="material-tabs">
        {['stream', 'classwork', 'people', 'attendance', 'meetings', 'chat', 'grades', 'gemini'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* TAB 1: STREAM */}
      {activeTab === 'stream' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="material-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setShowAnnouncementModal(true)}>
            <div className="user-avatar">{user?.name ? user.name.charAt(0) : 'U'}</div>
            <div style={{ color: 'var(--text-muted)', flex: 1, fontSize: '0.95rem' }}>Announce something to your class...</div>
            <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>Post</button>
          </div>

          {announcements.length === 0 ? (
            <EmptyState title="No Announcements" message="This is where you can post announcements and updates to your class." icon="campaign" />
          ) : (
            announcements.map((ann) => (
              <div key={ann._id} className="material-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img src={ann.author?.profilePhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'} className="user-avatar" alt={ann.author?.name} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{ann.author?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{new Date(ann.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{ann.content}</p>

                {/* Comments Section */}
                {ann.comments && ann.comments.length > 0 && (
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ann.comments.map((c, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', backgroundColor: 'var(--bg-hover)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontWeight: 600 }}>{c.author?.name}: </span>
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: CLASSWORK */}
      {activeTab === 'classwork' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => setShowAssignmentModal(true)}>
                <Plus size={16} /> Create Assignment
              </button>
              <button className="btn btn-secondary" onClick={() => setShowMaterialModal(true)}>
                <Upload size={16} /> Upload Notes / Study Material
              </button>
            </div>
          )}

          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: 600 }}>Assignments & Quizzes</h3>
            {assignments.length === 0 ? (
              <EmptyState title="No Assignments Posted" message="Your teacher hasn't posted any assignments yet." icon="assignment" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {assignments.map((ass) => (
                  <div
                    key={ass._id}
                    className="material-card"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => navigate(`/assignment/${ass._id}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FileText size={24} color="#1a73e8" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{ass.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                          Due: {new Date(ass.dueDate).toLocaleString()} • Max Marks: {ass.maxMarks}
                        </div>
                      </div>
                    </div>
                    {ass.myStatus ? (
                      <span className={`chip ${ass.myStatus === 'GRADED' ? 'chip-success' : ass.myStatus === 'SUBMITTED' ? 'chip-info' : 'chip-warning'}`}>
                        {ass.myStatus}
                      </span>
                    ) : (
                      <span className="chip chip-info">PUBLISHED</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: 600, marginTop: '16px' }}>Study Materials & Notes</h3>
            {materials.length === 0 ? (
              <EmptyState title="No Materials Uploaded" message="No study notes or materials have been shared in this class." icon="folder" />
            ) : (
              <div className="grid-2">
                {materials.map((mat) => (
                  <div key={mat._id} className="material-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <BookOpen size={20} color="#34a853" />
                      <span style={{ fontWeight: 600 }}>{mat.title}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '12px' }}>{mat.description}</p>
                    <span className="chip chip-success">{mat.topic}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PEOPLE */}
      {activeTab === 'people' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '8px', color: 'var(--primary)' }}>Teachers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {roster.teachers.map((t) => (
                <div key={t._id} className="material-card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={t.profilePhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'} className="user-avatar" alt={t.name} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{t.email} • {t.department}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ borderBottom: '2px solid var(--secondary)', paddingBottom: '8px', color: 'var(--secondary)' }}>
              Classroom Students ({roster.students.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {roster.students.map((s) => (
                <div key={s._id} className="material-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="user-avatar">{s.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{s.studentId || 'ID: CS2026'} • {s.email}</div>
                    </div>
                  </div>
                  <span className="chip chip-success">Enrolled</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
            <div className="material-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-container)' }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--on-primary-container)' }}>Start New Attendance Session</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '2px' }}>Open a 15-minute window for students to log attendance</p>
              </div>
              <button className="btn btn-primary" onClick={handleStartAttendanceSession}>
                <Clock size={16} /> Open Attendance Window
              </button>
            </div>
          )}

          {attendanceData?.activeSession && (
            <div className="material-card" style={{ border: '2px solid var(--primary)', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="chip chip-info" style={{ marginBottom: '8px' }}>ATTENDANCE ACTIVE NOW</span>
                  <h3 style={{ margin: 0 }}>{attendanceData.activeSession.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                    Opened at: {new Date(attendanceData.activeSession.startTime).toLocaleTimeString()}
                  </p>
                </div>
                {user?.role === 'STUDENT' && (
                  <button className="btn btn-primary" onClick={() => handleMarkPresent(attendanceData.activeSession)}>
                    <CheckSquare size={18} /> Mark Present
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Attendance Stats Cards */}
          <div className="material-card">
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Attendance Performance Summary</h3>
            
            {user?.role === 'STUDENT' ? (
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--apple-green)' }}>
                  Your Attendance: {attendanceData?.stats?.percentage ?? 100}%
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                  Attended {attendanceData?.stats?.attendedSessions || 0} of {attendanceData?.stats?.totalSessions || 0} total sessions.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--apple-green)', marginBottom: '16px' }}>
                  Overall Class Attendance Average: {
                    attendanceData?.studentStats && attendanceData.studentStats.length > 0
                      ? Math.round(attendanceData.studentStats.reduce((acc, curr) => acc + curr.percentage, 0) / attendanceData.studentStats.length)
                      : 100
                  }%
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {attendanceData?.studentStats && attendanceData.studentStats.length > 0 ? (
                    attendanceData.studentStats.map((st) => (
                      <div key={st.student?._id || st.student?.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-hover)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="user-avatar">{st.student?.name?.charAt(0) || 'S'}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{st.student?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{st.student?.email}</div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span className={`chip ${st.percentage >= 75 ? 'chip-success' : 'chip-danger'}`}>
                            {st.percentage}% Attendance ({st.attendedCount}/{st.totalSessions} Sessions)
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>No attendance sessions conducted yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: LIVE CLASSES (WebRTC Meetings) */}
      {activeTab === 'meetings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
            <button className="btn btn-primary" onClick={() => setShowMeetingModal(true)} style={{ width: 'fit-content' }}>
              <Video size={18} /> Schedule WebRTC Live Class
            </button>
          )}

          {meetings.length === 0 ? (
            <EmptyState title="No Meetings Scheduled" message="Online WebRTC live classes will appear here." icon="video_call" />
          ) : (
            <div className="grid-2">
              {meetings.map((m) => (
                <div key={m._id} className="material-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className={`chip ${m.status === 'LIVE' ? 'chip-danger' : 'chip-info'}`}>{m.status}</span>
                      <h3 style={{ marginTop: '8px', fontSize: '1.1rem' }}>{m.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                        Start Time: {new Date(m.scheduledStartTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/meeting/${m._id}`)}
                    style={{ width: '100%', marginTop: '16px' }}
                  >
                    <Play size={16} /> Join WebRTC Room
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: CHAT */}
      {activeTab === 'chat' && (
        <div className="material-card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '8px' }}>
            {messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  alignSelf: msg.sender?._id === user?.id || msg.sender?._id === user?._id ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  backgroundColor: msg.sender?._id === user?.id || msg.sender?._id === user?._id ? 'var(--primary)' : 'var(--bg-hover)',
                  color: msg.sender?._id === user?.id || msg.sender?._id === user?._id ? 'white' : 'var(--text-main)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '2px', opacity: 0.8 }}>
                  {msg.sender?.name}
                </div>
                <div>{msg.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Send message to classroom chat..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
            />
            <button className="btn btn-primary" type="submit">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: GRADES */}
      {activeTab === 'grades' && (
        <div className="material-card">
          <h3 style={{ marginBottom: '16px' }}>Gradebook Matrix</h3>
          {gradebook?.studentMatrix ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '10px' }}>Student</th>
                    {gradebook.assignments.map((a) => (
                      <th key={a._id} style={{ padding: '10px' }}>{a.title} ({a.maxMarks})</th>
                    ))}
                    <th style={{ padding: '10px' }}>Overall %</th>
                  </tr>
                </thead>
                <tbody>
                  {gradebook.studentMatrix.map((sm) => (
                    <tr key={sm.student._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{sm.student.name}</td>
                      {sm.grades.map((g, idx) => (
                        <td key={idx} style={{ padding: '10px' }}>
                          {g.marksObtained !== null ? `${g.marksObtained}/${g.maxMarks}` : '—'}
                        </td>
                      ))}
                      <td style={{ padding: '10px', fontWeight: 700, color: 'var(--primary)' }}>{sm.overallPercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Gradebook data is loading or empty.</p>
          )}
        </div>
      )}

      {/* TAB 8: GEMINI AI */}
      {activeTab === 'gemini' && (
        <div className="material-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sparkles size={24} color="#a142f4" />
            <h3 style={{ margin: 0 }}>Contextual Gemini AI Assistant</h3>
          </div>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Ask questions tailored specifically to <strong>{classroom.name}</strong> notes and assignments.
          </p>

          <form onSubmit={handleAskGemini} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              value={geminiPrompt}
              onChange={(e) => setGeminiPrompt(e.target.value)}
              placeholder="e.g. Explain Unit 1 loss functions or generate 3 practice quiz questions..."
              style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
            />
            <button className="btn btn-primary" type="submit" disabled={geminiLoading} style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #a142f4 100%)' }}>
              <Sparkles size={16} /> {geminiLoading ? 'Thinking...' : 'Ask Gemini'}
            </button>
          </form>

          {geminiReply && (
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-md)', fontSize: '0.95rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {geminiReply}
            </div>
          )}
        </div>
      )}

      {/* Modal: Announcement */}
      <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title="Post Announcement">
        <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <textarea
            rows={4}
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Share something with your class..."
            required
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
          />
          <button className="btn btn-primary" type="submit">Post Announcement</button>
        </form>
      </Modal>

      {/* Modal: Material */}
      <Modal isOpen={showMaterialModal} onClose={() => setShowMaterialModal(false)} title="Upload Study Material">
        <form onSubmit={handleCreateMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text"
            value={matTitle}
            onChange={(e) => setMatTitle(e.target.value)}
            placeholder="Title (e.g. Unit 1 Lecture Notes)"
            required
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
          />
          <textarea
            rows={3}
            value={matDesc}
            onChange={(e) => setMatDesc(e.target.value)}
            placeholder="Description..."
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
          />
          <button className="btn btn-primary" type="submit">Publish Material</button>
        </form>
      </Modal>

      {/* Modal: Assignment */}
      <Modal isOpen={showAssignmentModal} onClose={() => setShowAssignmentModal(false)} title="Create Assignment">
        <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text"
            value={assTitle}
            onChange={(e) => setAssTitle(e.target.value)}
            placeholder="Assignment Title *"
            required
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
          />
          <textarea
            rows={3}
            value={assDesc}
            onChange={(e) => setAssDesc(e.target.value)}
            placeholder="Instructions & Guidelines..."
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Due Date & Time *</label>
              <input
                type="datetime-local"
                value={assDueDate}
                onChange={(e) => setAssDueDate(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Max Marks</label>
              <input
                type="number"
                value={assMaxMarks}
                onChange={(e) => setAssMaxMarks(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
              />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">Create & Publish Assignment</button>
        </form>
      </Modal>

      {/* Modal: Schedule Meeting */}
      <Modal isOpen={showMeetingModal} onClose={() => setShowMeetingModal(false)} title="Schedule WebRTC Online Class">
        <form onSubmit={handleScheduleMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text"
            value={meetTitle}
            onChange={(e) => setMeetTitle(e.target.value)}
            placeholder="Meeting Title *"
            required
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
          />
          <input
            type="datetime-local"
            value={meetTime}
            onChange={(e) => setMeetTime(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}
          />
          <button className="btn btn-primary" type="submit">Schedule Meeting</button>
        </form>
      </Modal>
    </div>
  );
};

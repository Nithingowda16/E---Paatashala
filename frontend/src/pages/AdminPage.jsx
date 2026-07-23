import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import { Shield, Users, BookOpen, Video, HardDrive, CheckCircle2, XCircle } from 'lucide-react';

export const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      if (statsRes.data.success) setStats(statsRes.data.stats);

      const usersRes = await api.get('/admin/users');
      if (usersRes.data.success) setUsersList(usersRes.data.users);

      const logsRes = await api.get('/admin/logs');
      if (logsRes.data.success) setLogs(logsRes.data.logs);
    } catch (err) {
      showToast('Error loading admin statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, { status: nextStatus });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="material-card">Access Denied. Admin privileges required.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="material-card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Shield size={28} color="#ea4335" />
        <div>
          <h2 style={{ margin: 0 }}>System Administration & Audit Console</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', margin: 0 }}>System performance metrics, user status controls, and audit logs.</p>
        </div>
      </div>

      {/* Admin Stat Cards */}
      {stats && (
        <div className="grid-4">
          <div className="material-card">
            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Total Registered Users</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '4px' }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stats.totalTeachers} Teachers • {stats.totalStudents} Students</div>
          </div>
          <div className="material-card">
            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Active Classrooms</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '4px', color: '#1a73e8' }}>{stats.totalClassrooms}</div>
          </div>
          <div className="material-card">
            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>WebRTC Meetings</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '4px', color: '#ea4335' }}>{stats.totalMeetings}</div>
          </div>
          <div className="material-card">
            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>Upload Storage Used</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '4px', color: '#34a853' }}>{stats.storageUsageMB}</div>
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="material-card">
        <h3 style={{ marginBottom: '16px' }}>User Accounts Management</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Role</th>
                <th style={{ padding: '10px' }}>Department</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '10px' }}>{u.email}</td>
                  <td style={{ padding: '10px' }}><span className="chip chip-info">{u.role}</span></td>
                  <td style={{ padding: '10px' }}>{u.department}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`chip ${u.accountStatus === 'ACTIVE' ? 'chip-success' : 'chip-danger'}`}>{u.accountStatus}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    {u.role !== 'ADMIN' && (
                      <button
                        className={`btn ${u.accountStatus === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                        style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                        onClick={() => handleToggleUserStatus(u._id, u.accountStatus)}
                      >
                        {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="material-card">
        <h3 style={{ marginBottom: '16px' }}>System Activity Audit Logs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
          {logs.map((log) => (
            <div key={log._id} style={{ padding: '10px', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 600 }}>{log.user?.name || 'User'}</span>: {log.action} — {log.details} ({new Date(log.createdAt).toLocaleString()})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { FileText, Send, CheckCircle2, Award, Clock, ArrowLeft } from 'lucide-react';

export const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [textResponse, setTextResponse] = useState('');
  const [loading, setLoading] = useState(true);

  // Teacher grading states
  const [submissionsSummary, setSubmissionsSummary] = useState(null);
  const [rosterSubmissions, setRosterSubmissions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marksInput, setMarksInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  const fetchAssignment = async () => {
    try {
      const res = await api.get(`/assignments/${id}`);
      if (res.data.success) {
        setAssignment(res.data.assignment);
        setMySubmission(res.data.mySubmission);
        if (res.data.mySubmission?.textResponse) {
          setTextResponse(res.data.mySubmission.textResponse);
        }
      }
    } catch (err) {
      showToast('Error loading assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherSubmissions = async () => {
    if (user?.role === 'TEACHER' || user?.role === 'ADMIN') {
      try {
        const res = await api.get(`/assignments/${id}/submissions`);
        if (res.data.success) {
          setSubmissionsSummary(res.data.summary);
          setRosterSubmissions(res.data.rosterSubmissions);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchAssignment();
    fetchTeacherSubmissions();
  }, [id, user]);

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/assignments/${id}/submit`, { textResponse });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setMySubmission(res.data.submission);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Submission failed', 'error');
    }
  };

  const handleGradeStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      const res = await api.post(`/assignments/${id}/grade`, {
        studentId: selectedStudent.student._id,
        marksObtained: marksInput,
        feedback: feedbackInput,
      });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setSelectedStudent(null);
        setMarksInput('');
        setFeedbackInput('');
        fetchTeacherSubmissions();
      }
    } catch (err) {
      showToast('Grading error', 'error');
    }
  };

  if (loading) return <SkeletonLoader count={2} />;
  if (!assignment) return <div>Assignment not found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} /> Back to Classroom
      </button>

      <div className="material-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{assignment.title}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '4px' }}>
              Created by {assignment.createdBy?.name} • Due: {new Date(assignment.dueDate).toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
              {assignment.maxMarks} Points
            </div>
          </div>
        </div>

        <div style={{ margin: '20px 0', padding: '16px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {assignment.instructions || assignment.description || 'No detailed instructions provided.'}
        </div>
      </div>

      {/* STUDENT VIEW */}
      {user?.role === 'STUDENT' && (
        <div className="material-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '12px' }}>Your Submission Work</h3>

          {mySubmission?.status === 'GRADED' && (
            <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#e6f4ea', borderRadius: 'var(--radius-sm)', color: '#137333' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                Graded: {mySubmission.marksObtained} / {assignment.maxMarks} Marks ({Math.round((mySubmission.marksObtained / assignment.maxMarks) * 100)}%)
              </div>
              {mySubmission.feedback && <div style={{ marginTop: '4px', fontSize: '0.9rem' }}>Feedback: "{mySubmission.feedback}"</div>}
            </div>
          )}

          <form onSubmit={handleSubmitWork} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                Text Response / Solution
              </label>
              <textarea
                rows={5}
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                placeholder="Type your complete solution or code response here..."
                required
                disabled={mySubmission?.status === 'GRADED'}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
              />
            </div>

            {mySubmission?.status !== 'GRADED' && (
              <button className="btn btn-primary" type="submit" style={{ width: 'fit-content' }}>
                <Send size={16} /> {mySubmission ? 'Resubmit Assignment' : 'Turn In Assignment'}
              </button>
            )}
          </form>
        </div>
      )}

      {/* TEACHER GRADING INTERFACE */}
      {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
        <div className="material-card">
          <h3 style={{ marginBottom: '16px' }}>Student Submissions & Grading Roster</h3>

          {submissionsSummary && (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div className="chip chip-info">Assigned: {submissionsSummary.assigned}</div>
              <div className="chip chip-success">Submitted: {submissionsSummary.submitted}</div>
              <div className="chip chip-warning">Late: {submissionsSummary.late}</div>
              <div className="chip chip-danger">Missing: {submissionsSummary.missing}</div>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '10px' }}>Student Name</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Submitted At</th>
                  <th style={{ padding: '10px' }}>Marks</th>
                  <th style={{ padding: '10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rosterSubmissions.map((item) => (
                  <tr key={item.student._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{item.student.name}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`chip ${item.status === 'GRADED' ? 'chip-success' : item.status === 'SUBMITTED' ? 'chip-info' : 'chip-warning'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                      {item.submission?.submittedAt ? new Date(item.submission.submittedAt).toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: '10px', fontWeight: 700 }}>
                      {item.submission?.marksObtained !== undefined && item.submission?.marksObtained !== null
                        ? `${item.submission.marksObtained}/${assignment.maxMarks}`
                        : 'Not Graded'}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                        onClick={() => {
                          setSelectedStudent(item);
                          setMarksInput(item.submission?.marksObtained || '');
                          setFeedbackInput(item.submission?.feedback || '');
                        }}
                      >
                        Grade / Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grade Input Drawer */}
          {selectedStudent && (
            <div style={{ marginTop: '24px', padding: '20px', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ marginBottom: '12px' }}>Grading Work for {selectedStudent.student.name}</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
                Submission: "{selectedStudent.submission?.textResponse || 'No text submitted'}"
              </p>

              <form onSubmit={handleGradeStudent} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Marks (Max: {assignment.maxMarks})</label>
                  <input
                    type="number"
                    value={marksInput}
                    onChange={(e) => setMarksInput(e.target.value)}
                    required
                    style={{ width: '120px', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500 }}>Feedback</label>
                  <input
                    type="text"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Provide constructive feedback..."
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Return Grade
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

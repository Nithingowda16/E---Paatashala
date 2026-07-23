import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import { MessageSquare, Send, User } from 'lucide-react';

export const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const [classrooms, setClassrooms] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classrooms');
        if (res.data.success && res.data.classrooms.length > 0) {
          setClassrooms(res.data.classrooms);
          setSelectedClass(res.data.classrooms[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const fetchMsgs = async () => {
      try {
        const res = await api.get(`/chat/classroom/${selectedClass._id}`);
        if (res.data.success) setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMsgs();
  }, [selectedClass]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedClass) return;
    try {
      const res = await api.post('/chat/send', { classroomId: selectedClass._id, content: input });
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setInput('');
      }
    } catch (err) {
      showToast('Send failed', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' }}>
      {/* Sidebar: Class Chat Rooms */}
      <div className="material-card" style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Chat Channels</h3>
        {classrooms.map((c) => (
          <div
            key={c._id}
            onClick={() => setSelectedClass(c)}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: selectedClass?._id === c._id ? 'var(--primary-container)' : 'transparent',
              color: selectedClass?._id === c._id ? 'var(--on-primary-container)' : 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <MessageSquare size={18} />
            <div>
              <div style={{ fontSize: '0.9rem' }}>{c.name}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{c.subject}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chat Box */}
      <div className="material-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedClass ? (
          <>
            <div style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>
              #{selectedClass.name} Channel
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    alignSelf: msg.sender?._id === user?.id || msg.sender?._id === user?._id ? 'flex-end' : 'flex-start',
                    maxWidth: '65%',
                    backgroundColor: msg.sender?._id === user?.id || msg.sender?._id === user?._id ? 'var(--primary)' : 'var(--bg-hover)',
                    color: msg.sender?._id === user?.id || msg.sender?._id === user?._id ? 'white' : 'var(--text-main)',
                    padding: '10px 16px',
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

            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message #${selectedClass.name}...`}
                style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
              />
              <button className="btn btn-primary" type="submit">
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div>Select a channel to begin messaging.</div>
        )}
      </div>
    </div>
  );
};

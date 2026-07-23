import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import { Sparkles, Send, Plus, Trash2, BookOpen, HelpCircle, FileText, CheckCircle } from 'lucide-react';

export const GeminiPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/gemini/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSendQuery = async (queryText = prompt) => {
    if (!queryText.trim()) return;
    setLoading(true);

    const userMessage = { role: 'user', content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');

    try {
      const res = await api.post('/gemini/chat', {
        prompt: queryText,
        conversationId: activeConvId,
      });

      if (res.data.success) {
        setActiveConvId(res.data.conversationId);
        setMessages((prev) => [...prev, { role: 'model', content: res.data.reply }]);
        fetchConversations();
      }
    } catch (err) {
      showToast('Gemini query failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (str) => {
    setPrompt(str);
    handleSendQuery(str);
  };

  const handleNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' }}>
      {/* Sidebar: AI Chat History Threads */}
      <div className="material-card" style={{ width: '280px', display: 'flex', flexDirection: 'column', padding: '16px' }}>
        <button className="btn btn-primary" onClick={handleNewChat} style={{ marginBottom: '16px', background: 'linear-gradient(135deg, #1a73e8 0%, #a142f4 100%)' }}>
          <Plus size={18} /> New Gemini Chat
        </button>

        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '8px' }}>Recent Conversations</h4>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => {
                setActiveConvId(c._id);
                setMessages(c.messages || []);
              }}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeConvId === c._id ? 'var(--primary-container)' : 'transparent',
                color: activeConvId === c._id ? 'var(--on-primary-container)' : 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {c.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Gemini Chat Workspace */}
      <div className="material-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <Sparkles size={24} color="#a142f4" />
          <div>
            <h3 style={{ margin: 0 }}>Gemini AI Assistant Workspace</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>AI-generated info may require verification. Always review before publishing.</span>
          </div>
        </div>

        {/* Messages Body */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', maxWidth: '480px' }}>
              <Sparkles size={48} color="#a142f4" style={{ marginBottom: '12px' }} />
              <h3>How can Gemini help your learning today?</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Select a quick action below or type any educational topic question.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                <button className="chip chip-info" onClick={() => handleQuickPrompt('Summarize key concepts for Neural Networks Unit 1')}>
                  <BookOpen size={14} /> Summarize Notes
                </button>
                <button className="chip chip-success" onClick={() => handleQuickPrompt('Generate 3 practice quiz questions on Data Structures')}>
                  <HelpCircle size={14} /> Practice Quiz
                </button>
                <button className="chip chip-warning" onClick={() => handleQuickPrompt('Create a 7-day revision plan for upcoming exams')}>
                  <FileText size={14} /> Revision Plan
                </button>
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  backgroundColor: m.role === 'user' ? 'var(--primary)' : 'var(--bg-hover)',
                  color: m.role === 'user' ? 'white' : 'var(--text-main)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.content}
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }} style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Gemini anything about your course, assignments, or study materials..."
            style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}
          />
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #a142f4 100%)' }}>
            <Sparkles size={16} /> {loading ? 'Thinking...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar as CalendarIcon, Clock, BookOpen, Video } from 'lucide-react';

export const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/calendar');
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="material-card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CalendarIcon size={28} color="#1a73e8" />
        <div>
          <h2 style={{ margin: 0 }}>Academic Calendar & Deadlines</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', margin: 0 }}>Upcoming assignments, live WebRTC classes, and exams.</p>
        </div>
      </div>

      <div className="material-card">
        <h3 style={{ marginBottom: '16px' }}>Upcoming Schedule ({events.length} Events)</h3>

        {events.length === 0 ? (
          <p style={{ color: 'var(--text-sub)' }}>No academic events scheduled yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map((evt) => (
              <div key={evt.id} style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {evt.eventType === 'LIVE_CLASS' ? <Video size={22} color="#ea4335" /> : <BookOpen size={22} color="#1a73e8" />}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{evt.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>{evt.description}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`chip ${evt.eventType === 'LIVE_CLASS' ? 'chip-danger' : 'chip-info'}`}>
                    {evt.eventType}
                  </span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                    {new Date(evt.startDate).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  Shield,
} from 'lucide-react';

export const LiveMeetingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { showToast } = useContext(NotificationContext);

  const [meeting, setMeeting] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const [peers, setPeers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const localVideoRef = useRef();
  const localStreamRef = useRef(null);

  // Fetch meeting info
  useEffect(() => {
    const loadMeeting = async () => {
      try {
        const res = await api.get(`/meetings/classroom/${id}`);
        if (res.data.success && res.data.meetings.length > 0) {
          setMeeting(res.data.meetings[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadMeeting();
  }, [id]);

  // Setup Local Media Stream
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('[WebRTC Media Warning] Camera/Mic access restricted or missing:', err.message);
      }
    };
    initMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Socket WebRTC Handlers
  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('meeting:join', { meetingId: id, user: { id: user.id || user._id, name: user.name } });

    socket.on('meeting:peer-joined', ({ socketId, user: peerUser }) => {
      showToast(`${peerUser.name} joined the meeting`, 'info');
      setPeers((prev) => [...prev, { socketId, user: peerUser }]);
    });

    socket.on('meeting:peer-left', ({ socketId, user: peerUser }) => {
      showToast(`${peerUser.name} left the meeting`, 'info');
      setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
    });

    socket.on('meeting:hand-status', ({ user: peerUser, isRaised }) => {
      if (isRaised) showToast(`${peerUser.name} raised hand ✋`, 'info');
    });

    // Periodic join-log send to backend for attendance percentage
    const interval = setInterval(() => {
      api.post(`/meetings/${id}/join-log`, { durationMinutes: 2 }).catch(() => {});
    }, 120000); // every 2 mins

    return () => {
      socket.emit('meeting:leave', { meetingId: id, user: { id: user.id || user._id, name: user.name } });
      socket.off('meeting:peer-joined');
      socket.off('meeting:peer-left');
      socket.off('meeting:hand-status');
      clearInterval(interval);
    };
  }, [socket, id, user]);

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !micOn));
      setMicOn(!micOn);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !videoOn));
      setVideoOn(!videoOn);
    }
  };

  const toggleRaiseHand = () => {
    const next = !handRaised;
    setHandRaised(next);
    if (socket) {
      socket.emit('meeting:raise-hand', { meetingId: id, user: { name: user.name }, isRaised: next });
    }
  };

  const handleEndMeeting = async () => {
    try {
      await api.post(`/meetings/${id}/end`);
      showToast('Meeting ended for everyone and participation attendance calculated.', 'success');
      navigate(-1);
    } catch (err) {
      navigate(-1);
    }
  };

  const handleSendMeetingChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: user?.name, text: chatInput }]);
    setChatInput('');
  };

  return (
    <div style={{ height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column', backgroundColor: '#121212', color: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', backgroundColor: '#1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{meeting?.title || 'WebRTC Live Online Class'}</h3>
          <span style={{ fontSize: '0.8rem', color: '#aaaaaa' }}>Code: {meeting?.meetingCode || 'MEET-AI-LAB1'}</span>
        </div>
        <div className="chip chip-danger">● LIVE NOW</div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Video Grid */}
        <div style={{ flex: 1, padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', overflowY: 'auto' }}>
          {/* Local User Stream */}
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: 'var(--radius-md)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem' }}>
              {user?.name} (You)
            </div>
          </div>

          {/* Peer Streams */}
          {peers.map((p, idx) => (
            <div key={idx} style={{ backgroundColor: '#2a2a2a', borderRadius: 'var(--radius-md)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
              <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                {p.user?.name ? p.user.name.charAt(0) : 'S'}
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '0.8rem' }}>
                {p.user?.name}
              </div>
            </div>
          ))}
        </div>

        {/* Side Panel: Meeting Chat */}
        {showChat && (
          <div style={{ width: '320px', backgroundColor: '#1e1e1e', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column', padding: '16px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>In-Call Chat</h4>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chatMessages.map((m, idx) => (
                <div key={idx} style={{ backgroundColor: '#2a2a2a', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{m.sender}</div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMeetingChat} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send message..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-pill)', border: 'none', backgroundColor: '#2a2a2a', color: 'white' }}
              />
              <button className="btn btn-primary" type="submit" style={{ padding: '8px 12px' }}>
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div style={{ height: '70px', backgroundColor: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <button className="icon-btn" onClick={toggleMic} style={{ backgroundColor: micOn ? '#333' : '#ea4335', color: 'white' }}>
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button className="icon-btn" onClick={toggleVideo} style={{ backgroundColor: videoOn ? '#333' : '#ea4335', color: 'white' }}>
          {videoOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
        </button>

        <button className="icon-btn" onClick={toggleRaiseHand} style={{ backgroundColor: handRaised ? 'var(--primary)' : '#333', color: 'white' }}>
          <Hand size={20} />
        </button>

        <button className="icon-btn" onClick={() => setShowChat(!showChat)} style={{ backgroundColor: '#333', color: 'white' }}>
          <MessageSquare size={20} />
        </button>

        <button className="btn btn-danger" onClick={handleEndMeeting} style={{ borderRadius: 'var(--radius-pill)', padding: '10px 24px' }}>
          <PhoneOff size={18} /> {user?.role === 'TEACHER' ? 'End Meeting for All' : 'Leave Class'}
        </button>
      </div>
    </div>
  );
};

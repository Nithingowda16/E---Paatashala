export const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);

    // Join User personal room for target alerts
    socket.on('user:join', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined personal room user:${userId}`);
      }
    });

    // Join Classroom room
    socket.on('classroom:join', (classroomId) => {
      if (classroomId) {
        socket.join(`classroom:${classroomId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room classroom:${classroomId}`);
      }
    });

    // Chat Typing Indicator
    socket.on('chat:typing', ({ classroomId, userName }) => {
      socket.to(`classroom:${classroomId}`).emit('chat:typing', { userName });
    });

    // WebRTC Meeting Signaling
    socket.on('meeting:join', ({ meetingId, user }) => {
      socket.join(`meeting:${meetingId}`);
      console.log(`[Meeting WebRTC] User ${user.name} (${user.id}) joined meeting:${meetingId}`);
      socket.to(`meeting:${meetingId}`).emit('meeting:peer-joined', { socketId: socket.id, user });
    });

    socket.on('webrtc:offer', ({ toSocketId, offer, senderUser }) => {
      io.to(toSocketId).emit('webrtc:offer', { fromSocketId: socket.id, offer, senderUser });
    });

    socket.on('webrtc:answer', ({ toSocketId, answer }) => {
      io.to(toSocketId).emit('webrtc:answer', { fromSocketId: socket.id, answer });
    });

    socket.on('webrtc:ice-candidate', ({ toSocketId, candidate }) => {
      io.to(toSocketId).emit('webrtc:ice-candidate', { fromSocketId: socket.id, candidate });
    });

    socket.on('meeting:raise-hand', ({ meetingId, user, isRaised }) => {
      io.to(`meeting:${meetingId}`).emit('meeting:hand-status', { socketId: socket.id, user, isRaised });
    });

    socket.on('meeting:leave', ({ meetingId, user }) => {
      socket.leave(`meeting:${meetingId}`);
      socket.to(`meeting:${meetingId}`).emit('meeting:peer-left', { socketId: socket.id, user });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

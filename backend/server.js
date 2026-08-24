import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSocketIO } from './sockets/socketHandler.js';
import { startBackgroundJobs } from './jobs/scheduler.js';
import { runSeed } from './seeders/seed.js';
import { User } from './models/User.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import classroomRoutes from './routes/classroomRoutes.js';
import streamRoutes from './routes/streamRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

app.set('io', io);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/admin', adminRoutes);

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'NxtWave Online AI LMS Backend',
    timestamp: new Date().toISOString(),
  });
});

// Socket & Jobs Setup
setupSocketIO(io);
startBackgroundJobs();

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect Database, Check Auto-Seed & Start Server
connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database] Database is empty. Running auto-seeder for quick demo login...');
      await runSeed();
    }
  } catch (err) {
    console.error('[Auto-Seed Check Error]', err.message);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 LMS Backend Server running on http://127.0.0.1:${PORT}`);
    console.log(`📡 Socket.IO Real-time Engine initialized`);
    console.log(`=======================================================`);
  });
});

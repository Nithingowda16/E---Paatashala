import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // If explicit cloud MongoDB URI provided
  if (uri && uri.startsWith('mongodb+srv://')) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`[Database Warning] Atlas connection error: ${error.message}`);
    }
  }

  // Attempt local MongoDB with fast 2s timeout
  if (uri && !uri.startsWith('mongodb+srv://')) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`[Database] Local MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`[Database Warning] Standalone local MongoDB unavailable on 127.0.0.1:27017.`);
    }
  }

  // Fallback to In-Memory MongoDB Server (v7.0.3 for Debian 12 / Render compatibility)
  try {
    console.log('[Database] Starting Embedded In-Memory MongoDB Server (v7.0.3)...');
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.3',
      },
    });
    const memoryUri = mongoServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] Embedded In-Memory MongoDB Connected! (${memoryUri})`);
  } catch (err) {
    console.error('[Database Fatal Error]', err.message);
  }
};

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

dotenv.config();

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

// Setup CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

async function startServer() {
  try {
    await pubClient.connect();
    await subClient.connect();
    io.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Connected to Redis adapter for Socket.IO');
  } catch (err) {
    console.warn('⚠️ Could not connect to Redis. Falling back to in-memory adapter. Ensure Redis is running if you need scaling.');
  }

  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
  } catch (err) {
    console.warn('⚠️ Could not connect to PostgreSQL. Check your DATABASE_URL in backend/.env');
  }

  // Socket.IO Events
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join a specific user room for private events
    socket.on('setup', (userId) => {
      socket.join(userId);
      console.log('User setup:', userId);
    });

    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log('User joined chat:', chatId);
    });

    socket.on('send_message', (message) => {
      socket.to(message.chatId).emit('receive_message', message);
    });

    socket.on('typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('typing', { chatId, userId });
    });

    socket.on('stop_typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('stop_typing', { chatId, userId });
    });

    // WebRTC Signaling
    socket.on('call_user', ({ userToCall, signalData, from, name }) => {
      io.to(userToCall).emit('call_incoming', { signal: signalData, from, name });
    });

    socket.on('answer_call', (data) => {
      io.to(data.to).emit('call_accepted', data.signal);
    });

    socket.on('end_call', ({ to }) => {
      io.to(to).emit('call_ended');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // REST API Routes
  app.get('/health', (req, res) => res.send('OK'));

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();

// server.js - Supabase/Prisma + Real-time + Image Upload Version
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { upload } from './src/config/cloudinary.js';
import cloudinary from './src/config/cloudinary.js';
import { registerUser, loginUser, getUserProfile, authenticateJWT } from './src/controllers/authController.js';

console.log('Process Env:',process.env.CLOUDINARY_API_KEY);
const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Create HTTP server and Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000',
      process.env.FRONTEND_URL
    ],
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
  }
});

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    'null'
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==================== HEALTH & TEST ROUTES ====================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'GreenGrid API is running with Supabase/Prisma & Real-time!',
    timestamp: new Date().toISOString(),
    version: '5.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'Supabase PostgreSQL with Prisma',
    realTime: 'Socket.io WebSocket enabled',
    imageUpload: 'Cloudinary enabled',
    authentication: 'JWT-based authentication',
    features: [
      'JWT User Authentication',
      'Real-time Reports',
      'Image Upload & Storage',
      'Push Notifications',
      'Admin Dashboard',
      'Prisma ORM'
    ]
  });
});

// ==================== IMAGE UPLOAD ROUTES ====================
app.post('/api/upload/images', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }
    const uploaded = [];
    for (const file of req.files) {
      uploaded.push({
        url: file.path,
        publicId: file.filename,
        width: file.width || 800,
        height: file.height || 600,
        format: file.format,
        size: file.size,
        uploadedAt: new Date().toISOString()
      });
    }
    io.emit('imageUploadComplete', {
      type: 'IMAGE_UPLOAD_COMPLETE',
      data: { imageCount: uploaded.length, images: uploaded },
      timestamp: new Date().toISOString()
    });
    res.json({ success: true, message: `Uploaded ${uploaded.length} image(s)`, images: uploaded });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ success: false, message: 'Image upload failed', error: err.message });
  }
});

app.delete('/api/upload/images/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Image not found' });
    }
  } catch (err) {
    console.error('Image deletion error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete image', error: err.message });
  }
});

// ==================== AUTHENTICATION ROUTES (JWT/Prisma) ====================
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/profile', authenticateJWT, getUserProfile);

// ==================== REPORTS ROUTES (Prisma-based) ====================
app.post('/api/reports', authenticateJWT, async (req, res) => {
  try {
    const { title, type='general', description, location, priority='medium', images=[], contactInfo={} } = req.body;
    const { userId } = req.user;
    if (!title || !location) {
      return res.status(400).json({ success: false, error: 'Title and location required' });
    }
    const report = await prisma.report.create({
      data: {
        title,
        type,
        description,
        location,
        priority,
        status: 'open',
        images,
        contactInfo,
        isEmergency: type === 'emergency',
        reportedById: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    io.emit('newReport', {
      type: 'NEW_REPORT',
      data: report,
      message: `New ${report.priority} priority report: ${report.title}`,
      timestamp: new Date().toISOString()
    });
    res.json({ success: true, message: 'Report created', report });
  } catch (err) {
    console.error('Create report error:', err);
    res.status(500).json({ success: false, error: 'Failed to create report' });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const { status, type, priority, limit=50, isEmergency } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;
    if (isEmergency === 'true') where.isEmergency = true;
    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      include: { reportedBy: { select: { id: true, fullName: true, email: true } } }
    });
    res.json({ success: true, reports, total: reports.length });
  } catch (err) {
    console.error('Get reports error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
});

// ==================== ADMIN ROUTES (Prisma-based) ====================
app.get('/api/admin/dashboard', authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    const [ totalUsers, totalReports, openReports, resolvedReports ] = await Promise.all([
      prisma.user.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: 'open' } }),
      prisma.report.count({ where: { status: 'resolved' } })
    ]);
    const reportsList = await prisma.report.findMany();
    let totalImages = 0, criticalCount = 0;
    reportsList.forEach(r => {
      if (r.images?.length) totalImages += r.images.length;
      if (r.priority === 'critical') criticalCount++;
    });
    res.json({
      success: true,
      data: {
        totalUsers,
        totalReports,
        openReports,
        resolvedReports,
        totalImages,
        criticalCount,
        serverUptime: Math.floor(process.uptime())
      }
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard' });
  }
});

// ==================== USER MANAGEMENT ROUTE ====================
app.get('/api/users', authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, fullName: true, role: true,
        phoneNumber: true, address: true, isActive: true,
        joinedAt: true, lastLogin: true, createdAt: true, updatedAt: true
      }
    });
    res.json({ success: true, users, total: users.length });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// ==================== SOCKET.IO CONNECTION ====================
io.on('connection', socket => {
  console.log('User connected:', socket.id);
  socket.on('joinAdmin', () => socket.join('admins'));
  socket.on('joinUser', userId => socket.join(`user_${userId}`));
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// ==================== 404 & ERROR HANDLERS ====================
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false, error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ==================== START SERVER ====================
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled rejections & uncaught exceptions
process.on('unhandledRejection', err => console.error('Unhandled Rejection:', err));
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

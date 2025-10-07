// server.js - Enhanced Supabase/Prisma + Real-time + Image Upload Version
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { upload } from './src/config/cloudinary.js';
import cloudinary from './src/config/cloudinary.js';
import { registerUser, loginUser, getUserProfile, authenticateJWT } from './src/controllers/authController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Create HTTP server and Socket.io
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5000",
            process.env.FRONTEND_URL
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
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
        console.log('📸 Processing image upload...');

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images provided'
            });
        }

        const uploadedImages = [];

        for (const file of req.files) {
            try {
                console.log('☁️ Image uploaded to Cloudinary:', file.path);

                uploadedImages.push({
                    url: file.path,
                    publicId: file.filename,
                    width: file.width || 800,
                    height: file.height || 600,
                    size: file.size,
                    format: file.format,
                    uploadedAt: new Date().toISOString()
                });

            } catch (processError) {
                console.error('❌ Failed to process image:', processError);
                continue;
            }
        }

        if (uploadedImages.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to upload any images'
            });
        }

        // 🔥 REAL-TIME: Notify about image upload completion
        io.emit('imageUploadComplete', {
            type: 'IMAGE_UPLOAD_COMPLETE',
            data: {
                imageCount: uploadedImages.length,
                images: uploadedImages
            },
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: `Successfully uploaded ${uploadedImages.length} image(s)`,
            images: uploadedImages,
            count: uploadedImages.length
        });

    } catch (error) {
        console.error('❌ Image upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: error.message
        });
    }
});

// Delete image from Cloudinary
app.delete('/api/upload/images/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }
    } catch (error) {
        console.error('❌ Image deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image',
            error: error.message
        });
    }
});

// ==================== AUTHENTICATION ROUTES (JWT/Prisma) ====================
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/profile', authenticateJWT, getUserProfile);

// Legacy routes (now removed - use JWT auth above)
app.post('/api/auth/sync', async (req, res) => {
    return res.status(410).json({
        success: false,
        error: 'This endpoint is deprecated. Use /api/auth/register and /api/auth/login instead.'
    });
});

// ==================== REPORTS ROUTES (Prisma-based) ====================
app.post('/api/reports', authenticateJWT, async (req, res) => {
    try {
        console.log('📋 Create report request:', req.body);
        const {
            title,
            type,
            description,
            location,
            priority,
            images,
            imageUrls,
            contactInfo
        } = req.body;

        const { userId } = req.user; // From JWT

        if (!title || !location) {
            return res.status(400).json({
                success: false,
                error: 'Title and location are required'
            });
        }

        const reportImages = imageUrls || images || [];

        // Create report using Prisma
        const newReport = await prisma.report.create({
            data: {
                title,
                type: type || 'general',
                description: description || '',
                location,
                priority: priority || 'medium',
                status: 'open',
                reportedById: userId,
                contactInfo: contactInfo || {},
                images: reportImages,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        console.log('✅ Report saved with Prisma:', newReport.id);

        // 🔥 REAL-TIME NOTIFICATIONS
        io.emit('newReport', {
            type: 'NEW_REPORT',
            data: newReport,
            message: `New ${priority || 'medium'} priority report: ${title}`,
            timestamp: new Date().toISOString()
        });

        // 🚨 URGENT ALERTS
        if (priority === 'critical' || priority === 'high') {
            io.to('admins').emit('urgentAlert', {
                type: 'URGENT_REPORT',
                data: newReport,
                message: `🚨 URGENT: ${title} in ${location}`,
                priority: priority,
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            message: 'Report created successfully',
            report: newReport,
            realTimeNotified: true,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Create report error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create report'
        });
    }
});

// Get reports with enhanced filtering (Prisma-based)
app.get('/api/reports', async (req, res) => {
    try {
        console.log('📋 Reports list request');
        const { status, type, priority, hasImages, limit = 50 } = req.query;

        const where = {};
        if (status) where.status = status;
        if (type) where.type = type;
        if (priority) where.priority = priority;

        const reports = await prisma.report.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            include: {
                reportedBy: {
                    select: { id: true, fullName: true, email: true }
                }
            }
        });

        res.json({
            success: true,
            reports,
            total: reports.length,
            filters: { status, type, priority, hasImages },
            features: {
                imageUploadEnabled: true,
                realTimeEnabled: true
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Reports list error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reports'
        });
    }
});

// ==================== ADMIN ROUTES (Prisma-based) ====================
app.get('/api/admin/dashboard', authenticateJWT, async (req, res) => {
    try {
        console.log('📊 Admin dashboard request');

        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }

        const [totalUsers, totalReports, activeReports, resolvedReports] = await Promise.all([
            prisma.user.count(),
            prisma.report.count(),
            prisma.report.count({ where: { status: 'open' } }),
            prisma.report.count({ where: { status: 'resolved' } })
        ]);

        // Get additional stats
        const reports = await prisma.report.findMany();
        let totalImages = 0;
        let criticalReports = 0;

        reports.forEach(report => {
            if (report.images && report.images.length > 0) {
                totalImages += report.images.length;
            }
            if (report.priority === 'critical') {
                criticalReports++;
            }
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                activeReports,
                resolvedReports,
                totalReports,
                totalImages,
                criticalReports,
                systemStatus: 'online',
                serverUptime: Math.floor(process.uptime()),
                lastUpdated: new Date().toISOString(),
                features: {
                    realTimeEnabled: true,
                    imageUploadEnabled: true,
                    pushNotificationsEnabled: true,
                    jwtAuthEnabled: true,
                    prismaEnabled: true
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Admin dashboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard data'
        });
    }
});

// ==================== USER MANAGEMENT ROUTES (Prisma-based) ====================
app.get('/api/users', authenticateJWT, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                phoneNumber: true,
                address: true,
                isActive: true,
                joinedAt: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true
                // Exclude passwordHash for security
            }
        });

        res.json({
            success: true,
            users,
            total: users.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Users list error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
});

// ==================== SOCKET.IO CONNECTION HANDLING ====================
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join admin room
    socket.on('joinAdmin', () => {
        socket.join('admins');
        console.log(`👨‍💼 Admin joined: ${socket.id}`);

        socket.emit('adminWelcome', {
            message: 'Connected to admin real-time updates',
            timestamp: new Date().toISOString()
        });
    });

    // Join user room
    socket.on('joinUser', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} joined: ${socket.id}`);

        socket.emit('userWelcome', {
            message: 'Connected to GreenGrid real-time updates',
            timestamp: new Date().toISOString()
        });
    });

    // Handle test events
    socket.on('testEvent', (data) => {
        console.log('🧪 Test event received:', data);
        socket.emit('testResponse', {
            success: true,
            receivedData: data,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
    });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.path} not found`,
        availableRoutes: [
            'GET /api/health',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/profile',
            'GET /api/users',
            'GET /api/reports',
            'POST /api/reports',
            'POST /api/upload/images',
            'DELETE /api/upload/images/:publicId',
            'GET /api/admin/dashboard'
        ],
        version: '5.0.0',
        timestamp: new Date().toISOString()
    });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

// ==================== START SERVER ====================
server.listen(PORT, () => {
    console.log('🚀 GreenGrid Backend v5.0 - Supabase/Prisma + JWT!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`🔥 Database: Supabase PostgreSQL with Prisma ORM`);
    console.log(`🔐 Authentication: JWT-based authentication`);
    console.log(`🔌 Real-time: Socket.io WebSocket enabled`);
    console.log(`☁️ Image Upload: Cloudinary enabled`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}/api/admin/dashboard`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

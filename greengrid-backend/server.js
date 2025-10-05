// server.js - Firebase Integrated Version with Real-time
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { db, auth } from './src/config/firebase.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and Socket.io FIRST
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5000"
        ],
        methods: ["GET", "POST"],
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
        message: 'GreenGrid API is running with Firebase & Real-time!',
        timestamp: new Date().toISOString(),
        version: '3.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: 'Firebase Firestore',
        realTime: 'Socket.io WebSocket enabled'
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test endpoint working with Firebase!',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/test', (req, res) => {
    console.log('📤 POST test request received:', req.body);
    res.json({
        success: true,
        message: 'POST test endpoint working!',
        data: req.body,
        timestamp: new Date().toISOString()
    });
});

// ==================== AUTHENTICATION ROUTES ====================
app.post('/api/auth/sync', async (req, res) => {
    try {
        console.log('📤 Auth sync request received:', req.body);
        const { uid, email, name, phone, photoURL, providerId } = req.body;

        if (!uid || !email) {
            return res.status(400).json({
                success: false,
                error: 'UID and email are required'
            });
        }

        // Check if user exists in Firestore
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        const userData = {
            uid,
            email,
            name: name || '',
            phone: phone || '',
            photoURL: photoURL || '',
            providerId: providerId || '',
            role: 'resident',
            status: 'active',
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (userDoc.exists) {
            // Update existing user
            await userRef.update(userData);
            console.log(`✅ User ${email} updated in Firestore`);
        } else {
            // Create new user
            userData.createdAt = new Date().toISOString();
            userData.profile = {
                address: '',
                communityId: '',
                preferences: {
                    notifications: true,
                    emailUpdates: true,
                    smsUpdates: !!phone
                }
            };
            await userRef.set(userData);
            console.log(`✅ New user ${email} created in Firestore`);
        }

        res.json({
            success: true,
            message: 'User synchronized successfully',
            user: userData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Auth sync error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to synchronize user data',
            message: error.message
        });
    }
});

// ==================== USER MANAGEMENT ROUTES ====================
app.get('/api/users', async (req, res) => {
    try {
        console.log('👥 Users list request');

        const usersSnapshot = await db.collection('users').get();
        const users = [];

        usersSnapshot.forEach(doc => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
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

app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`👤 User profile request for ID: ${id}`);

        const userDoc = await db.collection('users').doc(id).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: userDoc.id,
                ...userDoc.data()
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ User profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user profile'
        });
    }
});

// ==================== REPORTS ROUTES ====================
app.get('/api/reports', async (req, res) => {
    try {
        console.log('📋 Reports list request');
        const { status, type, priority } = req.query;

        let query = db.collection('reports');

        // Apply filters
        if (status) {
            query = query.where('status', '==', status);
        }
        if (type) {
            query = query.where('type', '==', type);
        }
        if (priority) {
            query = query.where('priority', '==', priority);
        }

        // Order by creation date (newest first)
        query = query.orderBy('createdAt', 'desc');

        const reportsSnapshot = await query.get();
        const reports = [];

        reportsSnapshot.forEach(doc => {
            reports.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            success: true,
            reports,
            total: reports.length,
            filters: { status, type, priority },
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

app.post('/api/reports', async (req, res) => {
    try {
        console.log('📋 Create report request:', req.body);
        const { title, type, description, location, priority, images, imageUrls } = req.body;

        if (!title || !location) {
            return res.status(400).json({
                success: false,
                error: 'Title and location are required'
            });
        }

        const newReport = {
            title,
            type: type || 'general',
            description: description || '',
            location,
            priority: priority || 'medium',
            status: 'open',
            reportedBy: 'Current User',
            reportedById: 'user123',
            images: imageUrls || images || [], // Support both field names
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to Firestore
        const docRef = await db.collection('reports').add(newReport);

        const reportWithId = {
            id: docRef.id,
            ...newReport
        };

        // 🔥 REAL-TIME: Notify all connected clients
        io.emit('newReport', {
            type: 'NEW_REPORT',
            data: reportWithId,
            message: `New ${priority} priority report: ${title}`,
            timestamp: new Date().toISOString()
        });

        // 🚨 URGENT ALERTS: Notify admins of high priority reports
        if (priority === 'critical' || priority === 'high') {
            io.to('admins').emit('urgentAlert', {
                type: 'URGENT_REPORT',
                data: reportWithId,
                message: `🚨 URGENT: ${title} in ${location}`,
                priority: priority,
                timestamp: new Date().toISOString()
            });
        }

        // 📊 DASHBOARD UPDATE: Update admin dashboard statistics
        io.emit('dashboardUpdate', {
            type: 'STATS_UPDATE',
            action: 'REPORT_CREATED',
            data: {
                reportId: docRef.id,
                priority: priority,
                type: type || 'general',
                hasImages: (imageUrls || images || []).length > 0
            },
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Report created successfully',
            report: reportWithId,
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

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        console.log('📊 Admin dashboard request');

        // Get real counts from Firestore
        const [usersSnapshot, reportsSnapshot] = await Promise.all([
            db.collection('users').get(),
            db.collection('reports').get()
        ]);

        const openReports = await db.collection('reports').where('status', '==', 'open').get();
        const completedReports = await db.collection('reports').where('status', '==', 'resolved').get();

        res.json({
            success: true,
            data: {
                totalUsers: usersSnapshot.size,
                activeReports: openReports.size,
                completedReports: completedReports.size,
                totalReports: reportsSnapshot.size,
                systemStatus: 'online',
                serverUptime: Math.floor(process.uptime()),
                lastUpdated: new Date().toISOString()
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

// ==================== SOCKET.IO CONNECTION HANDLING ====================
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join admin room for admin-specific notifications
    socket.on('joinAdmin', () => {
        socket.join('admins');
        console.log(`👨‍💼 Admin joined: ${socket.id}`);
    });

    // Join user room for user notifications
    socket.on('joinUser', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} joined: ${socket.id}`);
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
            'GET /api/test',
            'POST /api/test',
            'POST /api/auth/sync',
            'GET /api/users',
            'GET /api/users/:id',
            'GET /api/reports',
            'POST /api/reports',
            'POST /api/upload/images',
            'GET /api/admin/dashboard'
        ],
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
    console.log('🚀 GreenGrid Backend with Firebase & Real-time Started!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`🔥 Database: Firebase Firestore`);
    console.log(`🔌 Real-time: Socket.io WebSocket enabled`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
    console.log(`👥 Users: http://localhost:${PORT}/api/users`);
    console.log(`📋 Reports: http://localhost:${PORT}/api/reports`);
    console.log(`📊 Admin: http://localhost:${PORT}/api/admin/dashboard`);
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

// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
    origin: [
        'http://localhost:3000',  // Frontend
        'null'                    // File:// protocol (for admin panel)
    ],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic Routes
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'GreenGrid API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test endpoint working!',
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

app.post('/api/auth/sync', (req, res) => {
    console.log('📤 Auth sync request received:', req.body);
    res.json({
        success: true,
        message: 'User synchronized successfully',
        user: req.body,
        timestamp: new Date().toISOString()
    });
});

// Admin Routes (MOVED BEFORE 404 handler)
app.get('/api/admin/dashboard', (req, res) => {
    console.log('📊 Admin dashboard request');
    res.json({
        success: true,
        data: {
            totalUsers: 5,
            activeReports: 3,
            completedReports: 12,
            systemStatus: 'online',
            serverUptime: Math.floor(process.uptime()),
            lastUpdated: new Date().toISOString()
        }
    });
});

app.get('/api/admin/users', (req, res) => {
    console.log('👥 Admin users request');
    res.json({
        success: true,
        users: [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@greengrid.com',
                role: 'resident',
                status: 'active',
                joinedAt: '2025-10-04T00:00:00Z'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@greengrid.com',
                role: 'community-leader',
                status: 'active',
                joinedAt: '2025-10-03T00:00:00Z'
            }
        ],
        total: 2
    });
});

app.get('/api/admin/emergency/reports', (req, res) => {
    console.log('🚨 Admin emergency reports request');
    res.json({
        success: true,
        reports: [
            {
                id: 'EMR-123456',
                type: 'illegal-dumping',
                location: 'Main Street, Colombo',
                priority: 'high',
                status: 'pending',
                reportedBy: 'John Doe',
                reportedAt: '2025-10-04T05:30:00Z'
            },
            {
                id: 'EMR-123457',
                type: 'overflowing-bins',
                location: 'Park Road, Colombo',
                priority: 'medium',
                status: 'resolved',
                reportedBy: 'Jane Smith',
                reportedAt: '2025-10-03T10:15:00Z'
            }
        ],
        total: 2
    });
});

app.get('/api/admin/stats', (req, res) => {
    console.log('📈 Admin stats request');
    res.json({
        success: true,
        stats: {
            apiRequests: Math.floor(Math.random() * 1000) + 500,
            responseTime: '45ms',
            errorRate: '0.1%',
            databaseStatus: 'connected',
            smsCredits: 9850,
            storageUsed: '2.4GB'
        }
    });
});

// 404 handler (MUST be AFTER all other routes)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.path} not found`,
        availableRoutes: [
            'GET /api/health',
            'GET /api/test',
            'POST /api/test',
            'POST /api/auth/sync',
            'GET /api/admin/dashboard',
            'GET /api/admin/users',
            'GET /api/admin/emergency/reports',
            'GET /api/admin/stats'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 GreenGrid Backend Started Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test Endpoint: http://localhost:${PORT}/api/test`);
    console.log(`👤 Auth Sync: POST http://localhost:${PORT}/api/auth/sync`);
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

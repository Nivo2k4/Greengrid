// server.js - Complete GreenGrid Backend
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
        'http://localhost:5173',  // Vite dev server
        'null'                    // File:// protocol
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

// ==================== AUTHENTICATION ROUTES ====================
app.post('/api/auth/sync', (req, res) => {
    console.log('📤 Auth sync request received:', req.body);
    const { uid, email, name, phone, photoURL, providerId } = req.body;

    if (!uid || !email) {
        return res.status(400).json({
            success: false,
            error: 'UID and email are required'
        });
    }

    const userData = {
        uid,
        email,
        name: name || '',
        phone: phone || '',
        photoURL: photoURL || '',
        providerId,
        role: 'resident',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    res.json({
        success: true,
        message: 'User synchronized successfully',
        user: userData,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/login', (req, res) => {
    console.log('🔐 Login request received:', req.body);
    const { email, password } = req.body;

    res.json({
        success: true,
        message: 'Login successful',
        token: 'mock-jwt-token',
        user: {
            id: '1',
            email,
            name: 'John Doe',
            role: 'resident'
        },
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/logout', (req, res) => {
    console.log('🚪 Logout request received');
    res.json({
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString()
    });
});

// ==================== USER MANAGEMENT ROUTES ====================
app.get('/api/users', (req, res) => {
    console.log('👥 Users list request');
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
        total: 2,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(`👤 User profile request for ID: ${id}`);

    res.json({
        success: true,
        user: {
            id,
            name: 'John Doe',
            email: 'john@greengrid.com',
            role: 'resident',
            status: 'active',
            profile: {
                address: '123 Green Street, Colombo',
                phone: '+94701234567',
                communityId: 'COM-001'
            },
            joinedAt: '2025-10-04T00:00:00Z'
        },
        timestamp: new Date().toISOString()
    });
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(`📝 Update user ${id}:`, req.body);

    res.json({
        success: true,
        message: 'User updated successfully',
        user: { id, ...req.body },
        timestamp: new Date().toISOString()
    });
});

// ==================== REPORTS ROUTES ====================
app.get('/api/reports', (req, res) => {
    console.log('📋 Reports list request');
    const { status, type, priority } = req.query;

    res.json({
        success: true,
        reports: [
            {
                id: 'RPT-001',
                title: 'Waste Collection Issue',
                type: 'collection',
                status: 'open',
                priority: 'medium',
                location: 'Main Street, Colombo',
                description: 'Garbage not collected for 3 days',
                reportedBy: 'John Doe',
                createdAt: '2025-10-04T09:00:00Z'
            },
            {
                id: 'RPT-002',
                title: 'Recycling Bin Missing',
                type: 'infrastructure',
                status: 'resolved',
                priority: 'low',
                location: 'Park Road, Colombo',
                description: 'Blue recycling bin stolen',
                reportedBy: 'Jane Smith',
                createdAt: '2025-10-03T14:30:00Z'
            }
        ],
        total: 2,
        filters: { status, type, priority },
        timestamp: new Date().toISOString()
    });
});

app.post('/api/reports', (req, res) => {
    console.log('📋 Create report request:', req.body);
    const { title, type, description, location, priority } = req.body;

    if (!title || !location) {
        return res.status(400).json({
            success: false,
            error: 'Title and location are required'
        });
    }

    const newReport = {
        id: `RPT-${Date.now()}`,
        title,
        type: type || 'general',
        description: description || '',
        location,
        priority: priority || 'medium',
        status: 'open',
        reportedBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    res.json({
        success: true,
        message: 'Report created successfully',
        report: newReport,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/reports/:id', (req, res) => {
    const { id } = req.params;
    console.log(`📄 Report details request for ID: ${id}`);

    res.json({
        success: true,
        report: {
            id,
            title: 'Waste Collection Issue',
            type: 'collection',
            status: 'open',
            priority: 'medium',
            location: 'Main Street, Colombo',
            description: 'Detailed description of the waste collection problem...',
            reportedBy: 'John Doe',
            assignedTo: 'Waste Management Team',
            createdAt: '2025-10-04T09:00:00Z',
            updatedAt: '2025-10-04T10:30:00Z',
            comments: [
                {
                    id: 'CMT-001',
                    text: 'We have received your report and are investigating.',
                    author: 'Admin',
                    createdAt: '2025-10-04T10:30:00Z'
                }
            ]
        },
        timestamp: new Date().toISOString()
    });
});

app.put('/api/reports/:id', (req, res) => {
    const { id } = req.params;
    console.log(`📝 Update report ${id}:`, req.body);

    res.json({
        success: true,
        message: 'Report updated successfully',
        report: { id, ...req.body, updatedAt: new Date().toISOString() },
        timestamp: new Date().toISOString()
    });
});

// ==================== WASTE COLLECTION ROUTES ====================
app.get('/api/collections/schedule', (req, res) => {
    console.log('📅 Collection schedule request');
    res.json({
        success: true,
        schedule: [
            {
                id: 'SCH-001',
                area: 'Zone A - Colombo 01',
                type: 'general',
                date: '2025-10-05',
                time: '08:00',
                status: 'scheduled'
            },
            {
                id: 'SCH-002',
                area: 'Zone B - Colombo 02',
                type: 'recycling',
                date: '2025-10-05',
                time: '10:00',
                status: 'scheduled'
            }
        ],
        timestamp: new Date().toISOString()
    });
});

app.post('/api/collections/request', (req, res) => {
    console.log('🗑️ Collection request:', req.body);
    const { type, location, urgency } = req.body;

    res.json({
        success: true,
        message: 'Collection request submitted successfully',
        request: {
            id: `REQ-${Date.now()}`,
            type,
            location,
            urgency: urgency || 'normal',
            status: 'pending',
            requestedBy: 'Current User',
            createdAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/dashboard', (req, res) => {
    console.log('📊 Admin dashboard request');
    res.json({
        success: true,
        data: {
            totalUsers: 156,
            activeReports: 23,
            completedReports: 89,
            pendingCollections: 12,
            systemStatus: 'online',
            serverUptime: Math.floor(process.uptime()),
            lastUpdated: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
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
                joinedAt: '2025-10-04T00:00:00Z',
                lastActive: '2025-10-04T11:30:00Z'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@greengrid.com',
                role: 'community-leader',
                status: 'active',
                joinedAt: '2025-10-03T00:00:00Z',
                lastActive: '2025-10-04T09:15:00Z'
            }
        ],
        total: 156,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/admin/reports', (req, res) => {
    console.log('📋 Admin reports request');
    res.json({
        success: true,
        reports: [
            {
                id: 'RPT-001',
                title: 'Waste Collection Issue',
                status: 'open',
                priority: 'high',
                assignedTo: 'Team A',
                createdAt: '2025-10-04T09:00:00Z'
            }
        ],
        statistics: {
            total: 112,
            open: 23,
            inProgress: 12,
            resolved: 77
        },
        timestamp: new Date().toISOString()
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
                priority: 'critical',
                status: 'pending',
                reportedBy: 'John Doe',
                reportedAt: '2025-10-04T05:30:00Z',
                description: 'Large pile of hazardous waste'
            }
        ],
        total: 3,
        timestamp: new Date().toISOString()
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
            storageUsed: '2.4GB',
            activeUsers: 156,
            reportsToday: 12
        },
        timestamp: new Date().toISOString()
    });
});

// ==================== NOTIFICATIONS ROUTES ====================
app.get('/api/notifications', (req, res) => {
    console.log('🔔 Notifications request');
    res.json({
        success: true,
        notifications: [
            {
                id: 'NOT-001',
                title: 'Collection Scheduled',
                message: 'Your waste collection is scheduled for tomorrow at 8 AM',
                type: 'info',
                read: false,
                createdAt: '2025-10-04T10:00:00Z'
            },
            {
                id: 'NOT-002',
                title: 'Report Updated',
                message: 'Your report RPT-001 has been assigned to a team',
                type: 'success',
                read: true,
                createdAt: '2025-10-04T09:30:00Z'
            }
        ],
        unreadCount: 1,
        timestamp: new Date().toISOString()
    });
});

app.put('/api/notifications/:id/read', (req, res) => {
    const { id } = req.params;
    console.log(`📖 Mark notification ${id} as read`);

    res.json({
        success: true,
        message: 'Notification marked as read',
        timestamp: new Date().toISOString()
    });
});

// ==================== COMMUNITY ROUTES ====================
app.get('/api/community/events', (req, res) => {
    console.log('🎉 Community events request');
    res.json({
        success: true,
        events: [
            {
                id: 'EVT-001',
                title: 'Community Clean-up Day',
                description: 'Join us for a neighborhood cleanup',
                date: '2025-10-10',
                time: '09:00',
                location: 'Central Park',
                organizer: 'Green Community Group'
            }
        ],
        timestamp: new Date().toISOString()
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
            'POST /api/auth/login',
            'POST /api/auth/logout',
            'GET /api/users',
            'GET /api/users/:id',
            'PUT /api/users/:id',
            'GET /api/reports',
            'POST /api/reports',
            'GET /api/reports/:id',
            'PUT /api/reports/:id',
            'GET /api/collections/schedule',
            'POST /api/collections/request',
            'GET /api/admin/dashboard',
            'GET /api/admin/users',
            'GET /api/admin/reports',
            'GET /api/admin/emergency/reports',
            'GET /api/admin/stats',
            'GET /api/notifications',
            'PUT /api/notifications/:id/read',
            'GET /api/community/events'
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
app.listen(PORT, () => {
    console.log('🚀 GreenGrid Backend Started Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test Endpoints: http://localhost:${PORT}/api/test`);
    console.log(`🔐 Authentication: http://localhost:${PORT}/api/auth/*`);
    console.log(`👥 User Management: http://localhost:${PORT}/api/users`);
    console.log(`📋 Reports: http://localhost:${PORT}/api/reports`);
    console.log(`🗑️ Collections: http://localhost:${PORT}/api/collections/*`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/api/admin/*`);
    console.log(`🔔 Notifications: http://localhost:${PORT}/api/notifications`);
    console.log(`🎉 Community: http://localhost:${PORT}/api/community/*`);
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

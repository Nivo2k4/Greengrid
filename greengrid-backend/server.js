// server.js - Complete GreenGrid Backend with ALL APIs
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
        'http://localhost:3000',  // React frontend
        'http://localhost:5173',  // Vite dev server
        'null'                    // File protocol for admin panel
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

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Email and password are required'
        });
    }

    res.json({
        success: true,
        message: 'Login successful',
        token: 'mock-jwt-token-' + Date.now(),
        user: {
            id: '1',
            email,
            name: 'John Doe',
            role: 'resident',
            status: 'active'
        },
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/register', (req, res) => {
    console.log('📝 Register request received:', req.body);
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            error: 'Email, password, and name are required'
        });
    }

    res.json({
        success: true,
        message: 'Registration successful',
        user: {
            id: Date.now().toString(),
            email,
            name,
            phone: phone || '',
            role: 'resident',
            status: 'active',
            createdAt: new Date().toISOString()
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
                phone: '+94701234567',
                joinedAt: '2025-10-04T00:00:00Z',
                lastActive: '2025-10-04T11:30:00Z'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@greengrid.com',
                role: 'community-leader',
                status: 'active',
                phone: '+94707654321',
                joinedAt: '2025-10-03T00:00:00Z',
                lastActive: '2025-10-04T09:15:00Z'
            },
            {
                id: '3',
                name: 'Admin User',
                email: 'admin@greengrid.com',
                role: 'admin',
                status: 'active',
                phone: '+94701111111',
                joinedAt: '2025-10-01T00:00:00Z',
                lastActive: '2025-10-04T12:00:00Z'
            }
        ],
        total: 3,
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
            phone: '+94701234567',
            profile: {
                address: '123 Green Street, Colombo 03',
                communityId: 'COM-001',
                preferences: {
                    notifications: true,
                    emailUpdates: true,
                    smsUpdates: true
                }
            },
            joinedAt: '2025-10-04T00:00:00Z',
            lastActive: '2025-10-04T11:30:00Z'
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
        user: {
            id,
            ...req.body,
            updatedAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    console.log(`🗑️ Delete user ${id}`);

    res.json({
        success: true,
        message: 'User deleted successfully',
        timestamp: new Date().toISOString()
    });
});

// ==================== REPORTS ROUTES ====================
app.get('/api/reports', (req, res) => {
    console.log('📋 Reports list request');
    const { status, type, priority, userId } = req.query;

    res.json({
        success: true,
        reports: [
            {
                id: 'RPT-001',
                title: 'Waste Collection Issue',
                type: 'collection',
                status: 'open',
                priority: 'high',
                location: 'Main Street, Colombo 03',
                description: 'Garbage not collected for 3 days, causing bad odor',
                reportedBy: 'John Doe',
                reportedById: '1',
                assignedTo: 'Waste Management Team',
                createdAt: '2025-10-04T09:00:00Z',
                updatedAt: '2025-10-04T10:30:00Z'
            },
            {
                id: 'RPT-002',
                title: 'Recycling Bin Missing',
                type: 'infrastructure',
                status: 'resolved',
                priority: 'medium',
                location: 'Park Road, Colombo 02',
                description: 'Blue recycling bin was stolen from the corner',
                reportedBy: 'Jane Smith',
                reportedById: '2',
                assignedTo: 'Infrastructure Team',
                createdAt: '2025-10-03T14:30:00Z',
                updatedAt: '2025-10-04T08:15:00Z'
            },
            {
                id: 'RPT-003',
                title: 'Illegal Dumping',
                type: 'violation',
                status: 'in-progress',
                priority: 'critical',
                location: 'Industrial Area, Colombo 15',
                description: 'Large pile of construction waste dumped illegally',
                reportedBy: 'Admin User',
                reportedById: '3',
                assignedTo: 'Enforcement Team',
                createdAt: '2025-10-04T07:20:00Z',
                updatedAt: '2025-10-04T11:45:00Z'
            }
        ],
        total: 3,
        filters: { status, type, priority, userId },
        timestamp: new Date().toISOString()
    });
});

app.post('/api/reports', (req, res) => {
    console.log('📋 Create report request:', req.body);
    const { title, type, description, location, priority, images } = req.body;

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
        reportedById: '1',
        images: images || [],
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
            priority: 'high',
            location: 'Main Street, Colombo 03',
            description: 'Detailed description of the waste collection problem. The garbage has not been collected for 3 days and is starting to smell.',
            reportedBy: 'John Doe',
            reportedById: '1',
            assignedTo: 'Waste Management Team',
            images: [
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg'
            ],
            createdAt: '2025-10-04T09:00:00Z',
            updatedAt: '2025-10-04T10:30:00Z',
            comments: [
                {
                    id: 'CMT-001',
                    text: 'We have received your report and are investigating the issue.',
                    author: 'Admin User',
                    authorId: '3',
                    createdAt: '2025-10-04T10:30:00Z'
                },
                {
                    id: 'CMT-002',
                    text: 'Thank you for the quick response!',
                    author: 'John Doe',
                    authorId: '1',
                    createdAt: '2025-10-04T11:00:00Z'
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
        report: {
            id,
            ...req.body,
            updatedAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

app.delete('/api/reports/:id', (req, res) => {
    const { id } = req.params;
    console.log(`🗑️ Delete report ${id}`);

    res.json({
        success: true,
        message: 'Report deleted successfully',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/reports/:id/comments', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    console.log(`💬 Add comment to report ${id}:`, req.body);

    if (!text) {
        return res.status(400).json({
            success: false,
            error: 'Comment text is required'
        });
    }

    res.json({
        success: true,
        message: 'Comment added successfully',
        comment: {
            id: `CMT-${Date.now()}`,
            text,
            author: 'Current User',
            authorId: '1',
            createdAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

// ==================== WASTE COLLECTION ROUTES ====================
app.get('/api/collections/schedule', (req, res) => {
    console.log('📅 Collection schedule request');
    const { date, area, type } = req.query;

    res.json({
        success: true,
        schedule: [
            {
                id: 'SCH-001',
                area: 'Zone A - Colombo 01-05',
                type: 'general',
                date: '2025-10-05',
                time: '08:00',
                status: 'scheduled',
                truck: 'TRK-001',
                driver: 'Kamal Perera'
            },
            {
                id: 'SCH-002',
                area: 'Zone A - Colombo 01-05',
                type: 'recycling',
                date: '2025-10-05',
                time: '10:00',
                status: 'scheduled',
                truck: 'TRK-002',
                driver: 'Nimal Silva'
            },
            {
                id: 'SCH-003',
                area: 'Zone B - Colombo 06-10',
                type: 'general',
                date: '2025-10-06',
                time: '09:00',
                status: 'scheduled',
                truck: 'TRK-003',
                driver: 'Sunil Fernando'
            }
        ],
        filters: { date, area, type },
        timestamp: new Date().toISOString()
    });
});

app.post('/api/collections/request', (req, res) => {
    console.log('🗑️ Collection request:', req.body);
    const { type, location, urgency, description } = req.body;

    if (!type || !location) {
        return res.status(400).json({
            success: false,
            error: 'Type and location are required'
        });
    }

    res.json({
        success: true,
        message: 'Collection request submitted successfully',
        request: {
            id: `REQ-${Date.now()}`,
            type,
            location,
            urgency: urgency || 'normal',
            description: description || '',
            status: 'pending',
            requestedBy: 'Current User',
            requestedById: '1',
            estimatedCollection: '2025-10-06T08:00:00Z',
            createdAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/collections/requests', (req, res) => {
    console.log('📋 Collection requests list');
    const { status, type, userId } = req.query;

    res.json({
        success: true,
        requests: [
            {
                id: 'REQ-001',
                type: 'bulk',
                location: '45 Galle Road, Colombo 03',
                urgency: 'high',
                description: 'Large furniture items for disposal',
                status: 'approved',
                requestedBy: 'John Doe',
                requestedById: '1',
                estimatedCollection: '2025-10-06T08:00:00Z',
                createdAt: '2025-10-04T14:30:00Z'
            },
            {
                id: 'REQ-002',
                type: 'hazardous',
                location: '12 Marine Drive, Colombo 04',
                urgency: 'critical',
                description: 'Old paint cans and chemicals',
                status: 'pending',
                requestedBy: 'Jane Smith',
                requestedById: '2',
                estimatedCollection: '2025-10-05T10:00:00Z',
                createdAt: '2025-10-04T16:45:00Z'
            }
        ],
        total: 2,
        filters: { status, type, userId },
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
            emergencyReports: 3,
            systemStatus: 'online',
            serverUptime: Math.floor(process.uptime()),
            todayStats: {
                newReports: 8,
                completedCollections: 15,
                activeUsers: 45
            },
            lastUpdated: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/admin/users', (req, res) => {
    console.log('👥 Admin users request');
    const { role, status, page = 1, limit = 10 } = req.query;

    res.json({
        success: true,
        users: [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@greengrid.com',
                role: 'resident',
                status: 'active',
                phone: '+94701234567',
                joinedAt: '2025-10-04T00:00:00Z',
                lastActive: '2025-10-04T11:30:00Z',
                reportsCount: 5,
                location: 'Colombo 03'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@greengrid.com',
                role: 'community-leader',
                status: 'active',
                phone: '+94707654321',
                joinedAt: '2025-10-03T00:00:00Z',
                lastActive: '2025-10-04T09:15:00Z',
                reportsCount: 12,
                location: 'Colombo 02'
            },
            {
                id: '3',
                name: 'Admin User',
                email: 'admin@greengrid.com',
                role: 'admin',
                status: 'active',
                phone: '+94701111111',
                joinedAt: '2025-10-01T00:00:00Z',
                lastActive: '2025-10-04T12:00:00Z',
                reportsCount: 0,
                location: 'Colombo 01'
            }
        ],
        total: 156,
        page: parseInt(page),
        limit: parseInt(limit),
        filters: { role, status },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/admin/reports', (req, res) => {
    console.log('📋 Admin reports request');
    const { status, priority, type, assignedTo } = req.query;

    res.json({
        success: true,
        reports: [
            {
                id: 'RPT-001',
                title: 'Waste Collection Issue',
                status: 'open',
                priority: 'high',
                type: 'collection',
                location: 'Main Street, Colombo 03',
                reportedBy: 'John Doe',
                assignedTo: 'Team A',
                createdAt: '2025-10-04T09:00:00Z',
                updatedAt: '2025-10-04T10:30:00Z'
            },
            {
                id: 'RPT-002',
                title: 'Illegal Dumping',
                status: 'in-progress',
                priority: 'critical',
                type: 'violation',
                location: 'Industrial Area, Colombo 15',
                reportedBy: 'Jane Smith',
                assignedTo: 'Team B',
                createdAt: '2025-10-04T07:20:00Z',
                updatedAt: '2025-10-04T11:45:00Z'
            }
        ],
        statistics: {
            total: 112,
            open: 23,
            inProgress: 12,
            resolved: 77,
            byPriority: {
                critical: 5,
                high: 18,
                medium: 45,
                low: 44
            }
        },
        filters: { status, priority, type, assignedTo },
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
                location: 'Main Street, Colombo 03',
                priority: 'critical',
                status: 'pending',
                reportedBy: 'John Doe',
                reportedById: '1',
                reportedAt: '2025-10-04T05:30:00Z',
                description: 'Large pile of hazardous construction waste dumped near residential area',
                estimatedResponse: '2025-10-04T18:00:00Z'
            },
            {
                id: 'EMR-123457',
                type: 'overflowing-bins',
                location: 'Park Road, Colombo 02',
                priority: 'high',
                status: 'in-progress',
                reportedBy: 'Jane Smith',
                reportedById: '2',
                reportedAt: '2025-10-03T10:15:00Z',
                description: 'Multiple garbage bins overflowing for over a week',
                estimatedResponse: '2025-10-04T20:00:00Z'
            },
            {
                id: 'EMR-123458',
                type: 'hazardous-waste',
                location: 'Industrial Zone, Colombo 15',
                priority: 'critical',
                status: 'resolved',
                reportedBy: 'Admin User',
                reportedById: '3',
                reportedAt: '2025-10-04T08:00:00Z',
                description: 'Chemical spill detected near water source',
                resolvedAt: '2025-10-04T12:30:00Z'
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
            system: {
                apiRequests: Math.floor(Math.random() * 1000) + 500,
                responseTime: '45ms',
                errorRate: '0.1%',
                uptime: '99.9%'
            },
            database: {
                status: 'connected',
                size: '2.4GB',
                backupStatus: 'updated',
                lastBackup: '2025-10-04T00:00:00Z'
            },
            services: {
                smsCredits: 9850,
                emailsSent: 245,
                storageUsed: '2.4GB',
                activeConnections: 156
            },
            performance: {
                avgProcessingTime: '1.2s',
                peakUsers: 89,
                systemLoad: '23%'
            }
        },
        timestamp: new Date().toISOString()
    });
});

// ==================== NOTIFICATIONS ROUTES ====================
app.get('/api/notifications', (req, res) => {
    console.log('🔔 Notifications request');
    const { read, type, userId } = req.query;

    res.json({
        success: true,
        notifications: [
            {
                id: 'NOT-001',
                title: 'Collection Scheduled',
                message: 'Your waste collection is scheduled for tomorrow at 8:00 AM',
                type: 'info',
                category: 'collection',
                read: false,
                userId: '1',
                createdAt: '2025-10-04T10:00:00Z'
            },
            {
                id: 'NOT-002',
                title: 'Report Updated',
                message: 'Your report RPT-001 has been assigned to Team A',
                type: 'success',
                category: 'report',
                read: true,
                userId: '1',
                createdAt: '2025-10-04T09:30:00Z'
            },
            {
                id: 'NOT-003',
                title: 'Emergency Alert',
                message: 'Critical waste issue reported in your area',
                type: 'warning',
                category: 'emergency',
                read: false,
                userId: '1',
                createdAt: '2025-10-04T08:15:00Z'
            }
        ],
        unreadCount: 2,
        total: 3,
        filters: { read, type, userId },
        timestamp: new Date().toISOString()
    });
});

app.put('/api/notifications/:id/read', (req, res) => {
    const { id } = req.params;
    console.log(`📖 Mark notification ${id} as read`);

    res.json({
        success: true,
        message: 'Notification marked as read',
        notification: {
            id,
            read: true,
            readAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

app.post('/api/notifications', (req, res) => {
    console.log('🔔 Create notification:', req.body);
    const { title, message, type, category, userId } = req.body;

    if (!title || !message) {
        return res.status(400).json({
            success: false,
            error: 'Title and message are required'
        });
    }

    res.json({
        success: true,
        message: 'Notification created successfully',
        notification: {
            id: `NOT-${Date.now()}`,
            title,
            message,
            type: type || 'info',
            category: category || 'general',
            userId: userId || '1',
            read: false,
            createdAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

// ==================== COMMUNITY ROUTES ====================
app.get('/api/community/events', (req, res) => {
    console.log('🎉 Community events request');
    const { date, type, status } = req.query;

    res.json({
        success: true,
        events: [
            {
                id: 'EVT-001',
                title: 'Community Clean-up Day',
                description: 'Join us for a neighborhood cleanup drive. Bring your own gloves and bags!',
                type: 'cleanup',
                date: '2025-10-10',
                time: '09:00',
                duration: '3 hours',
                location: 'Central Park, Colombo 07',
                organizer: 'Green Community Group',
                organizerId: '2',
                maxParticipants: 50,
                currentParticipants: 23,
                status: 'upcoming',
                createdAt: '2025-10-01T00:00:00Z'
            },
            {
                id: 'EVT-002',
                title: 'Recycling Workshop',
                description: 'Learn how to properly sort and recycle different materials',
                type: 'education',
                date: '2025-10-15',
                time: '14:00',
                duration: '2 hours',
                location: 'Community Center, Colombo 03',
                organizer: 'EcoEducate Lanka',
                organizerId: '3',
                maxParticipants: 30,
                currentParticipants: 8,
                status: 'open',
                createdAt: '2025-09-28T00:00:00Z'
            }
        ],
        total: 2,
        filters: { date, type, status },
        timestamp: new Date().toISOString()
    });
});

app.post('/api/community/events', (req, res) => {
    console.log('🎉 Create community event:', req.body);
    const { title, description, type, date, time, location, maxParticipants } = req.body;

    if (!title || !date || !location) {
        return res.status(400).json({
            success: false,
            error: 'Title, date, and location are required'
        });
    }

    res.json({
        success: true,
        message: 'Event created successfully',
        event: {
            id: `EVT-${Date.now()}`,
            title,
            description: description || '',
            type: type || 'general',
            date,
            time: time || '09:00',
            location,
            organizer: 'Current User',
            organizerId: '1',
            maxParticipants: maxParticipants || 20,
            currentParticipants: 0,
            status: 'open',
            createdAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

app.post('/api/community/events/:id/join', (req, res) => {
    const { id } = req.params;
    console.log(`🎉 Join event ${id}`);

    res.json({
        success: true,
        message: 'Successfully joined the event',
        participation: {
            eventId: id,
            userId: '1',
            joinedAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

// ==================== ANALYTICS ROUTES ====================
app.get('/api/analytics/reports', (req, res) => {
    console.log('📊 Analytics reports request');
    const { period = '30d', type } = req.query;

    res.json({
        success: true,
        analytics: {
            period,
            totalReports: 145,
            resolvedReports: 98,
            averageResolutionTime: '2.3 days',
            reportsByType: {
                collection: 67,
                infrastructure: 23,
                violation: 18,
                hazardous: 12,
                other: 25
            },
            reportsByStatus: {
                open: 23,
                inProgress: 24,
                resolved: 98
            },
            trendData: [
                { date: '2025-09-04', reports: 8 },
                { date: '2025-09-11', reports: 12 },
                { date: '2025-09-18', reports: 15 },
                { date: '2025-09-25', reports: 10 },
                { date: '2025-10-02', reports: 18 }
            ]
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/analytics/collections', (req, res) => {
    console.log('📊 Analytics collections request');
    const { period = '30d' } = req.query;

    res.json({
        success: true,
        analytics: {
            period,
            totalCollections: 234,
            onTimeCollections: 198,
            delayedCollections: 36,
            averageCollectionTime: '45 minutes',
            collectionsByType: {
                general: 156,
                recycling: 78,
                bulk: 23,
                hazardous: 12
            },
            efficiencyRate: '84.6%',
            trendData: [
                { date: '2025-09-04', collections: 45 },
                { date: '2025-09-11', collections: 52 },
                { date: '2025-09-18', collections: 48 },
                { date: '2025-09-25', collections: 41 },
                { date: '2025-10-02', collections: 58 }
            ]
        },
        timestamp: new Date().toISOString()
    });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.path} not found`,
        availableRoutes: [
            // Health & Test
            'GET /api/health',
            'GET /api/test',
            'POST /api/test',
            // Authentication
            'POST /api/auth/sync',
            'POST /api/auth/login',
            'POST /api/auth/register',
            'POST /api/auth/logout',
            // User Management
            'GET /api/users',
            'GET /api/users/:id',
            'PUT /api/users/:id',
            'DELETE /api/users/:id',
            // Reports
            'GET /api/reports',
            'POST /api/reports',
            'GET /api/reports/:id',
            'PUT /api/reports/:id',
            'DELETE /api/reports/:id',
            'POST /api/reports/:id/comments',
            // Collections
            'GET /api/collections/schedule',
            'POST /api/collections/request',
            'GET /api/collections/requests',
            // Admin
            'GET /api/admin/dashboard',
            'GET /api/admin/users',
            'GET /api/admin/reports',
            'GET /api/admin/emergency/reports',
            'GET /api/admin/stats',
            // Notifications
            'GET /api/notifications',
            'PUT /api/notifications/:id/read',
            'POST /api/notifications',
            // Community
            'GET /api/community/events',
            'POST /api/community/events',
            'POST /api/community/events/:id/join',
            // Analytics
            'GET /api/analytics/reports',
            'GET /api/analytics/collections'
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
    console.log(`🧪 Test: GET/POST http://localhost:${PORT}/api/test`);
    console.log(`🔐 Authentication: http://localhost:${PORT}/api/auth/*`);
    console.log(`👥 Users: http://localhost:${PORT}/api/users`);
    console.log(`📋 Reports: http://localhost:${PORT}/api/reports`);
    console.log(`🗑️ Collections: http://localhost:${PORT}/api/collections/*`);
    console.log(`📊 Admin: http://localhost:${PORT}/api/admin/*`);
    console.log(`🔔 Notifications: http://localhost:${PORT}/api/notifications`);
    console.log(`🎉 Community: http://localhost:${PORT}/api/community/*`);
    console.log(`📈 Analytics: http://localhost:${PORT}/api/analytics/*`);
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

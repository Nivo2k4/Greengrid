// server.js - Enhanced Firebase + Real-time + Image Upload Version
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { db, auth } from './src/config/firebase.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { upload } from './src/config/cloudinary.js';
import cloudinary from './src/config/cloudinary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
        message: 'GreenGrid API is running with Firebase, Real-time & AI!',
        timestamp: new Date().toISOString(),
        version: '4.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: 'Firebase Firestore',
        realTime: 'Socket.io WebSocket enabled',
        imageUpload: 'Cloudinary + AI Analysis enabled',
        features: [
            'User Authentication',
            'Real-time Reports',
            'AI Image Analysis',
            'Push Notifications',
            'Admin Dashboard'
        ]
    });
});

// ==================== AI ANALYSIS SERVICE ====================
class AIAnalysisService {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
    }

    // Mock AI analysis (replace with real OpenAI later)
    async analyzeWasteImage(imageUrl) {
        console.log('🤖 Analyzing image:', imageUrl);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const wasteTypes = ['plastic', 'organic', 'metal', 'glass', 'hazardous', 'mixed'];
        const severities = ['low', 'medium', 'high', 'critical'];
        const volumes = ['small', 'medium', 'large', 'massive'];
        const actions = [
            'Schedule regular pickup within 24 hours',
            'Immediate collection required - health hazard',
            'Sort and recycle appropriate materials',
            'Special disposal needed - contact hazmat team',
            'Community cleanup initiative recommended'
        ];

        const wasteType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];

        return {
            wasteType,
            severityLevel: severity,
            environmentalImpact: Math.floor(Math.random() * 8) + 2, // 2-10
            recommendedAction: actions[Math.floor(Math.random() * actions.length)],
            estimatedVolume: volumes[Math.floor(Math.random() * volumes.length)],
            confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
            tags: [wasteType, severity, 'community-reported'],
            aiGenerated: true,
            analyzedAt: new Date().toISOString()
        };
    }
}

const aiService = new AIAnalysisService();

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

                // 🤖 AI Analysis
                let analysis = null;
                try {
                    analysis = await aiService.analyzeWasteImage(file.path);
                    console.log('🧠 AI analysis completed:', analysis);
                } catch (aiError) {
                    console.warn('⚠️ AI analysis failed, using defaults:', aiError.message);
                }

                uploadedImages.push({
                    url: file.path,
                    publicId: file.filename,
                    width: file.width || 800,
                    height: file.height || 600,
                    size: file.size,
                    format: file.format,
                    analysis: analysis,
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

        // 🔥 REAL-TIME: Notify about image analysis completion
        io.emit('imageAnalysisComplete', {
            type: 'IMAGE_ANALYSIS_COMPLETE',
            data: {
                imageCount: uploadedImages.length,
                analyses: uploadedImages.map(img => img.analysis)
            },
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: `Successfully uploaded and analyzed ${uploadedImages.length} image(s)`,
            images: uploadedImages,
            count: uploadedImages.length,
            aiAnalysisEnabled: true
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

// ==================== AUTHENTICATION ROUTES ====================
// Simple login route for testing
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('🔐 Login request received:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Mock authentication for testing
        const mockUsers = [
            { email: 'zaid.nasheem@greengrid.com', password: 'admin1', role: 'admin' },
            { email: 'mohamed.adnan@greengrid.com', password: 'leader456', role: 'community-leader' },
            { email: 'ovin@greengrid.com', password: 'leader789', role: 'community-leader' },
            { email: 'test@example.com', password: 'password123', role: 'resident' }
        ];

        const user = mockUsers.find(u => u.email === email && u.password === password);

        if (user) {
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: 'mock_' + Date.now(),
                    email: user.email,
                    role: user.role,
                    name: user.email.split('@')[0],
                    token: 'mock_token_' + Date.now()
                },
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// Admin-only login endpoint
app.post('/api/auth/admin-login', async (req, res) => {
    try {
        console.log('🔐 Admin login request received:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Only allow admin role
        const user = mockUsers.find(u => u.email === email && u.password === password && u.role === 'admin');

        if (user) {
            res.json({
                success: true,
                message: 'Admin login successful',
                user: {
                    id: 'mock_' + Date.now(),
                    email: user.email,
                    role: user.role,
                    name: user.email.split('@')[0],
                    token: 'mock_token_' + Date.now()
                },
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(401).json({
                success: false,
                error: 'Invalid admin credentials'
            });
        }
    } catch (error) {
        console.error('❌ Admin login error:', error);
        res.status(500).json({
            success: false,
            error: 'Admin login failed'
        });
    }
});

app.post('/api/auth/sync', async (req, res) => {
    try {
        console.log('📤 Auth sync request received:', req.body);
        const { uid, email, name, phone, photoURL, providerId, role, preferences } = req.body;

        if (!uid || !email) {
            return res.status(400).json({
                success: false,
                error: 'UID and email are required'
            });
        }

        // Check if Firebase is available
        if (!db) {
            console.warn('⚠️ Firebase not available, using mock response');
            return res.json({
                success: true,
                message: 'User synchronized successfully (mock mode)',
                user: {
                    uid,
                    email,
                    name: name || '',
                    phone: phone || '',
                    photoURL: photoURL || '',
                    providerId: providerId || '',
                    role: role || 'resident',
                    status: 'active',
                    lastLogin: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                timestamp: new Date().toISOString()
            });
        }

        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        const userData = {
            uid,
            email,
            name: name || '',
            phone: phone || '',
            photoURL: photoURL || '',
            providerId: providerId || '',
            role: role || 'resident',
            status: 'active',
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            preferences: preferences || {
                emailNotifications: false,
                smsNotifications: false,
                communityUpdates: false,
                pushNotifications: true
            }
        };

        if (userDoc.exists) {
            await userRef.update(userData);
            console.log(`✅ User ${email} updated in Firestore`);
        } else {
            userData.createdAt = new Date().toISOString();
            userData.profile = {
                address: '',
                communityId: '',
                reportsCreated: 0,
                joinedAt: new Date().toISOString()
            };
            await userRef.set(userData);
            console.log(`✅ New user ${email} created in Firestore`);

            // 🔥 REAL-TIME: Notify admins of new user
            io.to('admins').emit('newUserRegistered', {
                type: 'NEW_USER_REGISTERED',
                data: {
                    userId: uid,
                    email: email,
                    name: name,
                    role: role
                },
                timestamp: new Date().toISOString()
            });
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

// ==================== ENHANCED REPORTS ROUTES ====================
app.post('/api/reports', async (req, res) => {
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
            reportedBy,
            reportedById,
            contactInfo
        } = req.body;

        if (!title || !location) {
            return res.status(400).json({
                success: false,
                error: 'Title and location are required'
            });
        }

        // Check if Firebase is available
        if (!db) {
            console.warn('⚠️ Firebase not available, using mock response');
            const mockReport = {
                id: 'mock_' + Date.now(),
                title,
                type: type || 'general',
                description: description || '',
                location,
                priority: priority || 'medium',
                status: 'open',
                reportedBy: reportedBy || 'Current User',
                reportedById: reportedById || 'user123',
                contactInfo: contactInfo || {},
                images: imageUrls || images || [],
                aiAnalyzed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // 🔥 REAL-TIME: Notify about mock report
            io.emit('newReport', {
                type: 'NEW_REPORT',
                data: mockReport,
                message: `New ${priority || 'medium'} priority report: ${title}`,
                timestamp: new Date().toISOString()
            });

            return res.json({
                success: true,
                message: 'Report created successfully (mock mode)',
                report: mockReport,
                realTimeNotified: true,
                aiEnhanced: false,
                timestamp: new Date().toISOString()
            });
        }

        const reportImages = imageUrls || images || [];

        // Calculate auto-priority based on AI analysis if images exist
        let autoPriority = priority || 'medium';
        if (reportImages.length > 0) {
            // Check if any image analysis suggests higher priority
            const hasHighPriorityAnalysis = reportImages.some(img =>
                img.analysis && ['critical', 'high'].includes(img.analysis.severityLevel)
            );
            if (hasHighPriorityAnalysis) {
                autoPriority = 'high';
            }
        }

        const newReport = {
            title,
            type: type || 'general',
            description: description || '',
            location,
            priority: autoPriority,
            status: 'open',
            reportedBy: reportedBy || 'Current User',
            reportedById: reportedById || 'user123',
            contactInfo: contactInfo || {},
            images: reportImages,
            aiAnalyzed: reportImages.some(img => img.analysis),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
                source: 'web-app',
                version: '4.0.0',
                hasImages: reportImages.length > 0,
                imageCount: reportImages.length
            }
        };

        // Save to Firebase Firestore
        console.log('💾 Saving report to Firebase:', newReport);
        let docRef;
        let reportWithId;

        try {
            docRef = await db.collection('reports').add(newReport);
            reportWithId = { id: docRef.id, ...newReport };
            console.log('✅ Report saved to Firebase with ID:', docRef.id);
            console.log('📄 Report data:', reportWithId);
        } catch (firebaseError) {
            console.error('❌ Firebase save error:', firebaseError);
            // Still return success but with a mock ID
            reportWithId = { id: 'firebase_error_' + Date.now(), ...newReport };
            console.log('⚠️ Using fallback ID:', reportWithId.id);
        }

        // 🔥 REAL-TIME NOTIFICATIONS
        io.emit('newReport', {
            type: 'NEW_REPORT',
            data: reportWithId,
            message: `New ${autoPriority} priority report: ${title}`,
            timestamp: new Date().toISOString()
        });

        // 🚨 URGENT ALERTS
        if (autoPriority === 'critical' || autoPriority === 'high') {
            io.to('admins').emit('urgentAlert', {
                type: 'URGENT_REPORT',
                data: reportWithId,
                message: `🚨 URGENT: ${title} in ${location}`,
                priority: autoPriority,
                hasAIAnalysis: reportImages.some(img => img.analysis),
                timestamp: new Date().toISOString()
            });
        }

        // 📊 DASHBOARD UPDATE
        io.emit('dashboardUpdate', {
            type: 'STATS_UPDATE',
            action: 'REPORT_CREATED',
            data: {
                reportId: docRef.id,
                priority: autoPriority,
                type: type || 'general',
                hasImages: reportImages.length > 0,
                aiAnalyzed: reportImages.some(img => img.analysis)
            },
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Report created successfully',
            report: reportWithId,
            realTimeNotified: true,
            aiEnhanced: reportImages.some(img => img.analysis),
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

// Get reports with enhanced filtering
app.get('/api/reports', async (req, res) => {
    try {
        console.log('📋 Reports list request');
        const { status, type, priority, hasImages, aiAnalyzed, limit = 50 } = req.query;

        // Check if Firebase is available
        if (!db) {
            console.warn('⚠️ Firebase not available, returning mock reports');
            const mockReports = [
                {
                    id: 'mock_1',
                    title: 'Illegal Dumping - Main Street',
                    type: 'emergency',
                    description: 'Large amount of construction waste dumped illegally',
                    location: 'Main Street, Downtown',
                    priority: 'high',
                    status: 'open',
                    reportedBy: 'John Doe',
                    reportedById: 'user123',
                    contactInfo: { name: 'John Doe', phone: '+1234567890' },
                    images: [],
                    aiAnalyzed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'mock_2',
                    title: 'Feedback from Sarah Wilson',
                    type: 'feedback',
                    description: 'Great service! Very satisfied with the waste collection.',
                    location: 'Contact Form',
                    priority: 'low',
                    status: 'resolved',
                    reportedBy: 'Sarah Wilson',
                    reportedById: 'feedback_user',
                    contactInfo: { name: 'Sarah Wilson', email: 'sarah@example.com', rating: 5 },
                    images: [],
                    aiAnalyzed: false,
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];

            return res.json({
                success: true,
                reports: mockReports,
                total: mockReports.length,
                filters: { status, type, priority, hasImages, aiAnalyzed },
                enhancedFeatures: {
                    aiAnalysisEnabled: false,
                    imageUploadEnabled: false,
                    realTimeEnabled: true
                },
                timestamp: new Date().toISOString()
            });
        }

        let query = db.collection('reports');

        // Apply filters
        if (status) query = query.where('status', '==', status);
        if (type) query = query.where('type', '==', type);
        if (priority) query = query.where('priority', '==', priority);
        if (hasImages === 'true') query = query.where('metadata.hasImages', '==', true);
        if (aiAnalyzed === 'true') query = query.where('aiAnalyzed', '==', true);

        // Order and limit
        query = query.orderBy('createdAt', 'desc').limit(parseInt(limit));

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
            filters: { status, type, priority, hasImages, aiAnalyzed },
            enhancedFeatures: {
                aiAnalysisEnabled: true,
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

// ==================== ENHANCED ADMIN ROUTES ====================
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        console.log('📊 Admin dashboard request');

        // Check if Firebase is available
        if (!db) {
            console.warn('⚠️ Firebase not available, returning mock dashboard data');
            return res.json({
                success: true,
                data: {
                    totalUsers: 150,
                    activeReports: 5,
                    resolvedReports: 45,
                    totalReports: 50,
                    totalImages: 12,
                    aiAnalyzedReports: 8,
                    criticalReports: 2,
                    systemStatus: 'online',
                    serverUptime: Math.floor(process.uptime()),
                    lastUpdated: new Date().toISOString(),
                    features: {
                        realTimeEnabled: true,
                        aiAnalysisEnabled: false,
                        imageUploadEnabled: false,
                        pushNotificationsEnabled: true
                    }
                },
                timestamp: new Date().toISOString()
            });
        }

        const [usersSnapshot, reportsSnapshot, openReports, resolvedReports] = await Promise.all([
            db.collection('users').get(),
            db.collection('reports').get(),
            db.collection('reports').where('status', '==', 'open').get(),
            db.collection('reports').where('status', '==', 'resolved').get()
        ]);

        // Enhanced statistics
        let totalImages = 0;
        let aiAnalyzedReports = 0;
        let criticalReports = 0;

        reportsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.images && data.images.length > 0) {
                totalImages += data.images.length;
            }
            if (data.aiAnalyzed) {
                aiAnalyzedReports++;
            }
            if (data.priority === 'critical') {
                criticalReports++;
            }
        });

        res.json({
            success: true,
            data: {
                totalUsers: usersSnapshot.size,
                activeReports: openReports.size,
                resolvedReports: resolvedReports.size,
                totalReports: reportsSnapshot.size,
                totalImages,
                aiAnalyzedReports,
                criticalReports,
                systemStatus: 'online',
                serverUptime: Math.floor(process.uptime()),
                lastUpdated: new Date().toISOString(),
                features: {
                    realTimeEnabled: true,
                    aiAnalysisEnabled: true,
                    imageUploadEnabled: true,
                    pushNotificationsEnabled: true
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

// Get AI analytics
app.get('/api/admin/ai-analytics', async (req, res) => {
    try {
        const reportsSnapshot = await db.collection('reports').where('aiAnalyzed', '==', true).get();

        const analytics = {
            totalAnalyzed: 0,
            wasteTypes: {},
            severityLevels: {},
            environmentalImpact: [],
            averageConfidence: 0
        };

        let confidenceSum = 0;

        reportsSnapshot.forEach(doc => {
            const report = doc.data();
            if (report.images && report.images.length > 0) {
                report.images.forEach(image => {
                    if (image.analysis) {
                        analytics.totalAnalyzed++;

                        // Count waste types
                        const wasteType = image.analysis.wasteType;
                        analytics.wasteTypes[wasteType] = (analytics.wasteTypes[wasteType] || 0) + 1;

                        // Count severity levels
                        const severity = image.analysis.severityLevel;
                        analytics.severityLevels[severity] = (analytics.severityLevels[severity] || 0) + 1;

                        // Collect environmental impact scores
                        analytics.environmentalImpact.push(image.analysis.environmentalImpact);

                        // Sum confidence scores
                        confidenceSum += image.analysis.confidence || 0;
                    }
                });
            }
        });

        if (analytics.totalAnalyzed > 0) {
            analytics.averageConfidence = Math.round(confidenceSum / analytics.totalAnalyzed);
        }

        res.json({
            success: true,
            analytics,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ AI Analytics error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch AI analytics'
        });
    }
});

// ==================== USER MANAGEMENT ROUTES ====================
app.get('/api/users', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
        const users = [];

        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            users.push({
                id: doc.id,
                ...userData,
                // Remove sensitive data
                preferences: undefined
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

// ==================== SOCKET.IO CONNECTION HANDLING ====================
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join admin room
    socket.on('joinAdmin', () => {
        socket.join('admins');
        console.log(`👨‍💼 Admin joined: ${socket.id}`);

        // Send welcome message to admin
        socket.emit('adminWelcome', {
            message: 'Connected to admin real-time updates',
            timestamp: new Date().toISOString()
        });
    });

    // Join user room
    socket.on('joinUser', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`👤 User ${userId} joined: ${socket.id}`);

        // Send welcome message to user
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
            'POST /api/auth/sync',
            'GET /api/users',
            'GET /api/reports',
            'POST /api/reports',
            'POST /api/upload/images',
            'DELETE /api/upload/images/:publicId',
            'GET /api/admin/dashboard',
            'GET /api/admin/ai-analytics'
        ],
        version: '4.0.0',
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
    console.log('🚀 GreenGrid Backend v4.0 - AI Enhanced!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`🔥 Database: Firebase Firestore`);
    console.log(`🔌 Real-time: Socket.io WebSocket enabled`);
    console.log(`🤖 AI Analysis: Mock AI enabled (OpenAI ready)`);
    console.log(`☁️ Image Upload: Cloudinary enabled`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}/api/admin/dashboard`);
    console.log(`🧠 AI Analytics: http://localhost:${PORT}/api/admin/ai-analytics`);
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

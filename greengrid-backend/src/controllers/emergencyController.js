// src/controllers/emergencyController.js
import { PrismaClient } from '@prisma/client';
import { sendSMS } from '../services/smsService.js';

const prisma = new PrismaClient();

export const createEmergencyReport = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            location, 
            priority = 'high', 
            images = [], 
            contactInfo = {},
            type = 'emergency'
        } = req.body;

        const { userId } = req.user; // From JWT middleware

        // Validate required fields
        if (!title || !location) {
            return res.status(400).json({
                success: false,
                error: 'Title and location are required for emergency reports'
            });
        }

        // Create emergency report using Prisma
        const emergencyReport = await prisma.emergencyReport.create({
            data: {
                title,
                description: description || '',
                location,
                priority,
                type,
                status: 'open',
                reportedById: userId,
                contactInfo,
                images,
                isEmergency: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        console.log('🚨 Emergency report created:', emergencyReport.id);

        // Send SMS notification if phone number provided
        if (contactInfo.phone) {
            try {
                const smsMessage = `🚨 EMERGENCY REPORT: ${title} at ${location}. Report ID: ${emergencyReport.id}. GreenGrid Team will respond immediately.`;
                await sendSMS(contactInfo.phone, smsMessage);
                console.log('📱 Emergency SMS sent to:', contactInfo.phone);
            } catch (smsError) {
                console.warn('⚠️ SMS notification failed:', smsError.message);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Emergency report created successfully',
            report: emergencyReport,
            smsNotified: !!contactInfo.phone,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Create emergency report error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create emergency report',
            message: error.message
        });
    }
};

export const getEmergencyReports = async (req, res) => {
    try {
        const { 
            status, 
            priority, 
            limit = 50,
            userId,
            includeResolved = false 
        } = req.query;

        const { role, userId: requesterId } = req.user;

        // Build where clause
        const where = {
            isEmergency: true
        };

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (userId) where.reportedById = userId;
        
        // Non-admins can only see their own reports unless includeResolved is true
        if (role !== 'admin' && !includeResolved) {
            where.reportedById = requesterId;
        }

        const emergencyReports = await prisma.emergencyReport.findMany({
            where,
            orderBy: [
                { priority: 'desc' }, // Critical first
                { createdAt: 'desc' }
            ],
            take: parseInt(limit),
            include: {
                reportedBy: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        });

        res.json({
            success: true,
            reports: emergencyReports,
            total: emergencyReports.length,
            filters: { status, priority, userId },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Get emergency reports error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch emergency reports'
        });
    }
};

export const updateEmergencyReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes, responseTeam } = req.body;
        const { role, userId } = req.user;

        // Only admins and community leaders can update status
        if (role !== 'admin' && role !== 'community_leader') {
            return res.status(403).json({
                success: false,
                error: 'Admin or community leader access required'
            });
        }

        // Validate status
        const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        // Get existing report
        const existingReport = await prisma.emergencyReport.findUnique({
            where: { id },
            include: {
                reportedBy: {
                    select: { phoneNumber: true, fullName: true }
                }
            }
        });

        if (!existingReport) {
            return res.status(404).json({
                success: false,
                error: 'Emergency report not found'
            });
        }

        // Update report
        const updatedReport = await prisma.emergencyReport.update({
            where: { id },
            data: {
                status: status || existingReport.status,
                adminNotes: adminNotes || existingReport.adminNotes,
                responseTeam: responseTeam || existingReport.responseTeam,
                updatedById: userId,
                updatedAt: new Date(),
                ...(status === 'resolved' && { resolvedAt: new Date() })
            }
        });

        console.log(`✅ Emergency report ${id} updated to status: ${status}`);

        // Send SMS notification to reporter if status changed
        if (status && status !== existingReport.status && existingReport.reportedBy.phoneNumber) {
            try {
                let smsMessage = '';
                switch (status) {
                    case 'in-progress':
                        smsMessage = `🚨 UPDATE: Your emergency report "${existingReport.title}" is now being handled by our team. Report ID: ${id}`;
                        break;
                    case 'resolved':
                        smsMessage = `✅ RESOLVED: Your emergency report "${existingReport.title}" has been resolved. Thank you for reporting. Report ID: ${id}`;
                        break;
                    case 'closed':
                        smsMessage = `📋 CLOSED: Your emergency report "${existingReport.title}" has been closed. Report ID: ${id}`;
                        break;
                }
                
                if (smsMessage) {
                    await sendSMS(existingReport.reportedBy.phoneNumber, smsMessage);
                    console.log('📱 Status update SMS sent to reporter');
                }
            } catch (smsError) {
                console.warn('⚠️ Status update SMS failed:', smsError.message);
            }
        }

        res.json({
            success: true,
            message: 'Emergency report updated successfully',
            report: updatedReport,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Update emergency report error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update emergency report'
        });
    }
};

export const getEmergencyStats = async (req, res) => {
    try {
        const { role } = req.user;

        // Only admins can access stats
        if (role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }

        const [
            totalEmergencies,
            openEmergencies,
            inProgressEmergencies,
            resolvedEmergencies,
            criticalEmergencies,
            highPriorityEmergencies
        ] = await Promise.all([
            prisma.emergencyReport.count({ where: { isEmergency: true } }),
            prisma.emergencyReport.count({ where: { isEmergency: true, status: 'open' } }),
            prisma.emergencyReport.count({ where: { isEmergency: true, status: 'in-progress' } }),
            prisma.emergencyReport.count({ where: { isEmergency: true, status: 'resolved' } }),
            prisma.emergencyReport.count({ where: { isEmergency: true, priority: 'critical' } }),
            prisma.emergencyReport.count({ where: { isEmergency: true, priority: 'high' } })
        ]);

        // Get recent emergencies (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentEmergencies = await prisma.emergencyReport.count({
            where: {
                isEmergency: true,
                createdAt: {
                    gte: sevenDaysAgo
                }
            }
        });

        res.json({
            success: true,
            stats: {
                total: totalEmergencies,
                open: openEmergencies,
                inProgress: inProgressEmergencies,
                resolved: resolvedEmergencies,
                critical: criticalEmergencies,
                highPriority: highPriorityEmergencies,
                recentEmergencies,
                responseRate: totalEmergencies > 0 ? 
                    Math.round((resolvedEmergencies / totalEmergencies) * 100) : 0
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Emergency stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch emergency statistics'
        });
    }
};

export const deleteEmergencyReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, userId } = req.user;

        // Only admins can delete emergency reports
        if (role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin access required to delete emergency reports'
            });
        }

        const deletedReport = await prisma.emergencyReport.delete({
            where: { id }
        });

        console.log(`🗑️ Emergency report ${id} deleted by admin ${userId}`);

        res.json({
            success: true,
            message: 'Emergency report deleted successfully',
            deletedReport: { id: deletedReport.id, title: deletedReport.title },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        if (error.code === 'P2025') { // Prisma record not found
            return res.status(404).json({
                success: false,
                error: 'Emergency report not found'
            });
        }

        console.error('❌ Delete emergency report error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete emergency report'
        });
    }
};

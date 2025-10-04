// src/controllers/emergencyController.js
import { db } from '../config/firebase.js';
import { sendEmergencyAlert } from '../services/smsService.js';
import { uploadToCloudinary } from '../services/imageService.js';

export const submitEmergencyReport = async (req, res) => {
    try {
        const {
            issueType,
            location,
            description,
            priority,
            contactName,
            contactPhone
        } = req.body;

        // Validate required fields
        if (!issueType || !location || !description || !priority || !contactName || !contactPhone) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Generate unique report ID
        const reportId = `EMR-${Date.now().toString().slice(-6)}`;

        // Prepare report data
        const reportData = {
            id: reportId,
            issueType,
            location,
            description,
            priority,
            contactName,
            contactPhone,
            status: 'reported',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            images: [],
            assignedTo: null,
            resolvedAt: null,
            notes: []
        };

        // Save to Firestore
        await db.collection('emergencyReports').doc(reportId).set(reportData);

        // Send SMS notifications
        try {
            await sendEmergencyAlert(reportId, issueType, location, priority, contactPhone);
        } catch (smsError) {
            console.error('SMS notification failed:', smsError.message);
            // Don't fail the request if SMS fails
        }

        res.status(201).json({
            success: true,
            reportId,
            status: 'reported',
            message: 'Emergency report submitted successfully'
        });

    } catch (error) {
        console.error('Emergency report error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit emergency report'
        });
    }
};

export const uploadReportImages = async (req, res) => {
    try {
        const { reportId } = req.params;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No images provided'
            });
        }

        // Check if report exists
        const reportDoc = await db.collection('emergencyReports').doc(reportId).get();
        if (!reportDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Report not found'
            });
        }

        // Upload images to Cloudinary
        const uploadPromises = files.map(file =>
            uploadToCloudinary(file.buffer, `emergency-reports/${reportId}`)
        );

        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map(result => ({
            url: result.secure_url,
            publicId: result.public_id,
            uploadedAt: new Date().toISOString()
        }));

        // Update report with image URLs
        await db.collection('emergencyReports').doc(reportId).update({
            images: imageUrls,
            updatedAt: new Date().toISOString()
        });

        res.json({
            success: true,
            images: imageUrls,
            message: 'Images uploaded successfully'
        });

    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload images'
        });
    }
};

export const getEmergencyReports = async (req, res) => {
    try {
        const { status, priority, limit = 20, offset = 0 } = req.query;

        let query = db.collection('emergencyReports');

        // Apply filters
        if (status) {
            query = query.where('status', '==', status);
        }
        if (priority) {
            query = query.where('priority', '==', priority);
        }

        // Order by creation date (newest first)
        query = query.orderBy('createdAt', 'desc');

        // Apply pagination
        if (offset > 0) {
            query = query.offset(parseInt(offset));
        }
        query = query.limit(parseInt(limit));

        const snapshot = await query.get();
        const reports = snapshot.docs.map(doc => doc.data());

        res.json({
            success: true,
            reports,
            total: snapshot.size,
            hasMore: snapshot.size === parseInt(limit)
        });

    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch emergency reports'
        });
    }
};

export const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status, notes, assignedTo } = req.body;

        if (!['reported', 'investigating', 'in-progress', 'resolved', 'closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const updateData = {
            status,
            updatedAt: new Date().toISOString()
        };

        if (notes) {
            updateData.notes = notes;
        }

        if (assignedTo) {
            updateData.assignedTo = assignedTo;
        }

        if (status === 'resolved' || status === 'closed') {
            updateData.resolvedAt = new Date().toISOString();
        }

        await db.collection('emergencyReports').doc(reportId).update(updateData);

        res.json({
            success: true,
            message: 'Report status updated successfully'
        });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update report status'
        });
    }
};

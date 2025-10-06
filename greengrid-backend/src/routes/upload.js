// greengrid-backend/routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const aiAnalysis = require('../services/aiAnalysis');
const sharp = require('sharp');

// Upload images for reports
router.post('/images', upload.array('images', 5), async (req, res) => {
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
                // Optimize image with Sharp
                const optimizedBuffer = await sharp(file.buffer)
                    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 85 })
                    .toBuffer();

                // Upload to Cloudinary
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'image',
                            folder: 'greengrid-reports',
                            public_id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            transformation: [
                                { width: 1200, height: 1200, crop: 'limit' },
                                { quality: 'auto:good' }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(optimizedBuffer);
                });

                console.log('☁️ Image uploaded to Cloudinary:', result.secure_url);

                // 🤖 AI Analysis
                let analysis = null;
                try {
                    analysis = await aiAnalysis.analyzeWasteImage(result.secure_url);
                    console.log('🧠 AI analysis completed:', analysis);
                } catch (aiError) {
                    console.warn('⚠️ AI analysis failed, using defaults:', aiError.message);
                }

                uploadedImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                    size: result.bytes,
                    format: result.format,
                    analysis: analysis,
                    uploadedAt: new Date().toISOString()
                });

            } catch (uploadError) {
                console.error('❌ Failed to process image:', uploadError);
                continue; // Skip this image and continue with others
            }
        }

        if (uploadedImages.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Failed to upload any images'
            });
        }

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
router.delete('/images/:publicId', async (req, res) => {
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

module.exports = router;

// src/config/cloudinary.js - Enhanced Cloudinary Configuration
import cloudinary from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
    return !!(process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET);
};

// Configure Cloudinary only if credentials are available
if (isCloudinaryConfigured()) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Test Cloudinary connection
    const testConnection = async () => {
        try {
            const result = await cloudinary.api.ping();
            console.log('☁️ Cloudinary connection successful:', result);
            return true;
        } catch (error) {
            console.error('❌ Cloudinary connection failed:', error);
            return false;
        }
    };

    // Initialize connection test
    testConnection();
} else {
    console.warn('⚠️ Cloudinary not configured - image uploads will use local storage');
}

// Configure storage based on availability
let storage;
let upload;

if (isCloudinaryConfigured()) {
    // Use Cloudinary storage
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            return {
                folder: 'greengrid-reports',
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                public_id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' },
                    { quality: 'auto:good' },
                    { format: 'webp' }
                ],
                tags: ['greengrid', 'report', 'user-upload']
            };
        }
    });
} else {
    // Use local storage as fallback
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `report_${uniqueSuffix}_${file.originalname}`);
        }
    });
}

upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log('📁 File filter check:', file.mimetype);

        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

export { upload };
export default cloudinary;

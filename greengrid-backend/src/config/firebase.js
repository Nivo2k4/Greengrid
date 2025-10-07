// src/config/firebase.js - CORRECTED VERSION
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    // Try multiple possible locations for the service account file
    const possiblePaths = [
        join(__dirname, '../../firebase-service-account.json'),
        join(__dirname, '../../greengrid-project-firebase-adminsdk-fbsvc-e9f7a38c1e.json'),
        join(process.cwd(), 'firebase-service-account.json'),
        join(process.cwd(), 'greengrid-project-firebase-adminsdk-fbsvc-e9f7a38c1e.json')
    ];

    let serviceAccount = null;
    let usedPath = null;

    for (const path of possiblePaths) {
        try {
            serviceAccount = JSON.parse(readFileSync(path, 'utf8'));
            usedPath = path;
            console.log('✅ Found Firebase service account at:', path);
            break;
        } catch (err) {
            // Continue to next path
        }
    }

    if (!serviceAccount) {
        throw new Error('Firebase service account file not found in any of the expected locations');
    }

    // Initialize Firebase Admin
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id || 'greengrid-project'
        });
    }

    console.log('🔥 Firebase initialized successfully!');
    console.log('📁 Using service account from:', usedPath);

} catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.error('❌ Tried paths:', [
        join(__dirname, '../../firebase-service-account.json'),
        join(__dirname, '../../greengrid-project-firebase-adminsdk-fbsvc-e9f7a38c1e.json'),
        join(process.cwd(), 'firebase-service-account.json'),
        join(process.cwd(), 'greengrid-project-firebase-adminsdk-fbsvc-e9f7a38c1e.json')
    ]);

    // Don't exit in development, just warn
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    } else {
        console.warn('⚠️ Continuing without Firebase in development mode');
    }
}

// Export Firestore database
export const db = admin.apps.length > 0 ? admin.firestore() : null;
export const auth = admin.apps.length > 0 ? admin.auth() : null;

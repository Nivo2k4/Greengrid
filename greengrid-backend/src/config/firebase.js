// src/config/firebase.js - CORRECTED VERSION
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    // FIXED: Only go up 2 levels to reach greengrid-backend folder
    const serviceAccount = JSON.parse(
        readFileSync(
            join(__dirname, '../../firebase-service-account.json'),  // This is correct for your structure
            'utf8'
        )
    );

    // Initialize Firebase Admin
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: 'greengrid-89a99'
        });
    }

    console.log('🔥 Firebase initialized successfully!');

} catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.error('❌ Looking for file at:', join(__dirname, '../../firebase-service-account.json'));
    process.exit(1);
}

// Export Firestore database
export const db = admin.firestore();
export const auth = admin.auth();

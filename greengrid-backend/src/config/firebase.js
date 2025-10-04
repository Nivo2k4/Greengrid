// src/config/firebase.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read service account key
const serviceAccount = JSON.parse(
    readFileSync(
        join(__dirname, '../../firebase-service-account.json'),
        'utf8'
    )
);

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
    });
}

// Export Firestore database
export const db = admin.firestore();
export const auth = admin.auth();

console.log('🔥 Firebase initialized successfully!');

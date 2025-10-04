// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyARUy32W-OuWkK2xiJRnRsU4d3QCoV7d_E",
    authDomain: "greengrid-project.firebaseapp.com",
    projectId: "greengrid-project",
    storageBucket: "greengrid-project.firebasestorage.app",
    messagingSenderId: "695667687033",
    appId: "1:695667687033:web:db7305811e1b9f9b4f9ea8",
    measurementId: "G-C7FHPT48CT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

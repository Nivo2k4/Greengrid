// src/config/firebaseCompat.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARUy32W-OuWkK2xiJRnRsU4d3QCoV7d_E",
  authDomain: "greengrid-project.firebaseapp.com",
  projectId: "greengrid-project",
  storageBucket: "greengrid-project.firebasestorage.app",
  messagingSenderId: "695667687033",
  appId: "1:695667687033:web:db7305811e1b9f9b4f9ea8",
  measurementId: "G-C7FHPT48CT"
};

// Initialize Firebase compat (only if not already initialized)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

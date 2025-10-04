// src/controllers/authController.js
import { auth, db } from '../config/firebase.js';
import { sendSMS } from '../services/smsService.js';

export const registerUser = async (req, res) => {
    try {
        const { email, password, name, role = 'resident', phone, address } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                error: 'Email, password, and name are required'
            });
        }

        // Create user with Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
            phoneNumber: phone || null
        });

        // Save additional user data to Firestore
        const userData = {
            uid: userRecord.uid,
            email,
            name,
            role,
            phone: phone || '',
            address: address || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
            profile: {
                communityId: '',
                preferences: {
                    notifications: true,
                    emailUpdates: true,
                    smsUpdates: phone ? true : false
                }
            }
        };

        await db.collection('users').doc(userRecord.uid).set(userData);

        // Send welcome SMS if phone provided
        if (phone) {
            try {
                await sendSMS(phone, `🌱 Welcome to GreenGrid! Your account has been created successfully. Start managing waste efficiently with us.`);
            } catch (smsError) {
                console.log('Welcome SMS failed:', smsError.message);
            }
        }

        res.status(201).json({
            success: true,
            user: {
                uid: userRecord.uid,
                email,
                name,
                role,
                phone
            },
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Registration failed'
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // For demo purposes, we'll verify user exists in Firestore
        // In production, you'd use Firebase Auth REST API or client-side auth
        const usersSnapshot = await db.collection('users').where('email', '==', email).get();

        if (usersSnapshot.empty) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const userData = usersSnapshot.docs[0].data();

        // Update last login
        await db.collection('users').doc(userData.uid).update({
            lastLogin: new Date().toISOString()
        });

        res.json({
            success: true,
            user: {
                uid: userData.uid,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                phone: userData.phone
            },
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            success: false,
            error: 'Login failed'
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const { uid } = req.params;

        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const userData = userDoc.data();

        res.json({
            success: true,
            user: userData
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user profile'
        });
    }
};

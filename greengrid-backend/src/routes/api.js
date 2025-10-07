// Add this route to your existing api.js
router.post('/auth/sync', async (req, res) => {
    try {
        const { uid, email, name, phone, photoURL, providerId } = req.body;

        if (!uid || !email) {
            return res.status(400).json({
                success: false,
                error: 'UID and email are required'
            });
        }

        // Check if user exists
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        const userData = {
            uid,
            email,
            name: name || '',
            phone: phone || '',
            photoURL: photoURL || '',
            providerId,
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (userDoc.exists) {
            // Update existing user
            await userRef.update(userData);
            console.log(`✅ User ${email} updated`);
        } else {
            // Create new user
            userData.role = 'resident';
            userData.createdAt = new Date().toISOString();
            userData.status = 'active';
            userData.profile = {
                address: '',
                communityId: '',
                preferences: {
                    notifications: true,
                    emailUpdates: true,
                    smsUpdates: !!phone
                }
            };

            await userRef.set(userData);
            console.log(`✅ New user ${email} created`);
        }

        res.json({
            success: true,
            message: 'User synchronized successfully',
            user: userData
        });

    } catch (error) {
        console.error('❌ Auth sync error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to synchronize user data'
        });
    }
});

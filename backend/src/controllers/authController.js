const db = require('../config/db');
const { resolveUserFromRequest } = require('../middleware/authMiddleware');

const createUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await resolveUserFromRequest(req);
        const uid = user?.uid;

        if (!uid) {
            console.warn('Profile creation skipped: no user ID from token or request body');
            return res.status(200).json({ success: false, message: 'User ID required' });
        }

        if (!db) {
            return res.status(200).json({ success: true, message: 'Mock success - DB not connected' });
        }

        const { data: existing } = await db
            .from('user_profile')
            .select('id')
            .eq('id', uid)
            .maybeSingle();

        if (existing) {
            return res.status(200).json({ success: true, message: 'Profile already exists' });
        }

        const { error } = await db
            .from('user_profile')
            .insert([
                {
                    id: uid,
                    user_id: uid,
                    email: email || user.email || null,
                },
            ]);

        if (error) {
            console.error('Supabase profile insert error:', error.message || error);
            return res.status(500).json({ success: false, error: 'Failed to create user profile' });
        }

        return res.status(201).json({ success: true });
    } catch (error) {
        console.error('Create profile error:', error);
        return res.status(500).json({ success: false, error: 'Profile creation could not be completed' });
    }
};

module.exports = { createUserProfile };

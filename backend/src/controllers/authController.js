const db = require('../config/db');

const createUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const uid = req.user.uid;

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
                    name: name || null,
                    email: email || req.user.email || null,
                },
            ]);

        if (error) {
            console.error('Supabase profile insert error:', error.message || error);
            return res.status(500).json({ error: 'Failed to create user profile' });
        }

        return res.status(201).json({ success: true });
    } catch (error) {
        console.error('Create profile error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createUserProfile };

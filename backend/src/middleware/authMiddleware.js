const admin = require('firebase-admin');

let firebaseInitialized = false;

function initializeFirebaseAdmin() {
    if (firebaseInitialized) return;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        console.warn('Firebase Admin credentials missing. Auth middleware will reject requests.');
        return;
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });

    firebaseInitialized = true;
}

initializeFirebaseAdmin();

const authMiddleware = async (req, res, next) => {
    try {
        if (!firebaseInitialized) {
            return res.status(500).json({ error: 'Firebase Admin is not configured' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        req.user = { uid: decodedToken.uid, email: decodedToken.email || null };
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message || error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;

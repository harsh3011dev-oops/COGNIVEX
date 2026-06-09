const admin = require('firebase-admin');

let firebaseInitialized = false;

function getFallbackUserId(req) {
    return req.body?.userId || req.headers['user-id'] || null;
}

function initializeFirebaseAdmin() {
    if (firebaseInitialized) return;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        console.warn('Firebase Admin credentials missing. Auth will use userId fallback when provided.');
        return;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });

        firebaseInitialized = true;
    } catch (error) {
        console.error('Firebase Admin initialization failed:', error.message || error);
        console.warn('Auth will use userId fallback when provided.');
    }
}

initializeFirebaseAdmin();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (firebaseInitialized && authHeader?.startsWith('Bearer ')) {
            try {
                const token = authHeader.split('Bearer ')[1];
                const decodedToken = await admin.auth().verifyIdToken(token);

                req.user = { uid: decodedToken.uid, email: decodedToken.email || null };
                return next();
            } catch (error) {
                console.warn('Firebase token verification failed, trying userId fallback:', error.message || error);
            }
        }

        const fallbackUserId = getFallbackUserId(req);
        if (fallbackUserId) {
            req.user = { uid: fallbackUserId, email: null };
            return next();
        }

        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    } catch (error) {
        console.error('Auth middleware error:', error.message || error);

        const fallbackUserId = getFallbackUserId(req);
        if (fallbackUserId) {
            req.user = { uid: fallbackUserId, email: null };
            return next();
        }

        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;

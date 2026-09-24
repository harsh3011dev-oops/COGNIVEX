require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const aiRoutes = require('./routes/ai.routes');
const dailyRoutes = require('./routes/dailyRoutes');
const progressRoutes = require('./routes/progressRoutes');
const mlRoutes = require('./routes/mlRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://cognivex-jvjeo2592-harsh3011dev-oops-projects.vercel.app",
    /\.vercel\.app$/
  ]
}));
app.use(express.json());

// ---------------------------------------------------------------------------
// Health check endpoint (public — no auth required)
// Used by the self-ping keep-alive and external monitoring tools.
// ---------------------------------------------------------------------------
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        service: 'Cognivex Backend'
    });
});

// Main entry
app.get('/', (req, res) => {
    res.send('Cognivex Backend Running');
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/auth', authRoutes);

app.use(authMiddleware);
app.use('/onboarding', onboardingRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/practice', practiceRoutes);
app.use('/ai-tutor', aiRoutes);
app.use('/daily', dailyRoutes);
app.use('/progress', progressRoutes);
app.use('/ml', mlRoutes);
app.use('/questions', questionRoutes);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startKeepAlive();
});

// ---------------------------------------------------------------------------
// Self-ping keep-alive — prevents Render free tier from sleeping.
//
// Render sleeps a service after 15 minutes of inactivity.
// We ping our own /health endpoint every 14 minutes so the instance
// stays warm whether or not any user is on the frontend.
//
// 14 minutes = 840,000 ms
// ---------------------------------------------------------------------------
function startKeepAlive() {
    const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

    // Use native fetch (Node 18+) or fall back to node-fetch
    const fetchFn = typeof fetch !== 'undefined'
        ? fetch
        : (...args) => import('node-fetch').then(({ default: f }) => f(...args));

    setInterval(async () => {
        try {
            const start = Date.now();
            const res = await fetchFn(`${SELF_URL}/health`);
            const ms = Date.now() - start;
            if (res.ok) {
                console.log(`[keep-alive] ✅ ping OK — ${ms}ms — uptime: ${Math.floor(process.uptime())}s`);
            } else {
                console.warn(`[keep-alive] ⚠️  ping returned ${res.status}`);
            }
        } catch (err) {
            console.warn('[keep-alive] ❌ ping failed (server may be starting):', err.message || err);
        }
    }, PING_INTERVAL_MS);

    console.log(`[keep-alive] 🟢 Self-ping enabled every 14 min → ${SELF_URL}/health`);
}
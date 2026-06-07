require('dotenv').config();
const express = require('express');
const cors = require('cors');

const onboardingRoutes = require('./routes/onboardingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const aiRoutes = require('./routes/ai.routes');
const dailyRoutes = require('./routes/dailyRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://magenta-conkies-315dd7.netlify.app"
  ]
}));
app.use(express.json());

// Main entry
app.get('/', (req, res) => {
    res.send('Cognivex Backend Running');
});

// Routes
app.use('/onboarding', onboardingRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/practice', practiceRoutes);
app.use('/ai-tutor', aiRoutes);
app.use('/daily', dailyRoutes);
app.use('/progress', progressRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
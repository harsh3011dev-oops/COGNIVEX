const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createUserProfile } = require('../controllers/authController');

router.post('/profile', authMiddleware, createUserProfile);

module.exports = router;

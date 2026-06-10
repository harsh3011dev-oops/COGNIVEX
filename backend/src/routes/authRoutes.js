const express = require('express');
const router = express.Router();
const { createUserProfile } = require('../controllers/authController');

router.post('/profile', createUserProfile);

module.exports = router;

const express = require('express');
const router = express.Router();
const { askAITutor } = require('../controllers/ai.controller');

// POST /ai-tutor
router.post('/', askAITutor);

module.exports = router;

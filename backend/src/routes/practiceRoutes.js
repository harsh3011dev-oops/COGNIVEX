const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practiceController');

router.post('/submit-test', practiceController.submitTest);

module.exports = router;

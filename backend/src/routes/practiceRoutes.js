const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practiceController');
const quizController = require('../controllers/quizController');
const { handleUpload } = require('../middleware/uploadMiddleware');

router.post('/generate-from-pdf', handleUpload, quizController.generateFromPdf);
router.post('/submit-test', practiceController.submitTest);

module.exports = router;

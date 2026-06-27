const express = require('express');
const router = express.Router();
const {
    getSubjects,
    getQuestionsBySubject,
    getRandomQuestions,
    submitQuiz,
    getUserStats,
} = require('../controllers/questionController');

router.get('/subjects', getSubjects);
router.get('/subject/:subjectId', getQuestionsBySubject);
router.get('/random', getRandomQuestions);
router.post('/quiz/submit', submitQuiz);
router.get('/stats/:userId', getUserStats);

module.exports = router;

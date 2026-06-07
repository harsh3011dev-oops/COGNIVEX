const express = require('express');
const router = express.Router();
const {
    getTopicProgress,
    updateTopicProgress,
    getRoadmapProgress,
    updateRoadmapProgress
} = require('../controllers/progressController');

router.get('/topics', getTopicProgress);
router.post('/topics', updateTopicProgress);
router.get('/roadmap', getRoadmapProgress);
router.post('/roadmap', updateRoadmapProgress);

module.exports = router;

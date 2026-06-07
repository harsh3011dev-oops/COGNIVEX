const express = require('express');
const router = express.Router();
const dailyController = require('../controllers/dailyController');

router.get('/today-focus', dailyController.getTodayFocus);
router.post('/complete-task', dailyController.completeTask);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getMLProfile } = require('../controllers/mlController');

router.get('/profile/:userId', getMLProfile);

module.exports = router;

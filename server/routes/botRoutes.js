const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTip } = require('../controllers/botController');

router.get('/tip', auth, getTip);

module.exports = router;

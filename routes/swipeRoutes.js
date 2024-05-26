const express = require('express');
const { swipeDetails, conversations } = require('../controllers/swipeCtrl');
const router = express.Router();

router.post('/swipe-details', swipeDetails);
router.get('/conversations/:id', conversations)

module.exports = router;

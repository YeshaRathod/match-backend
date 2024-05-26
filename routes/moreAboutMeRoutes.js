const express = require('express');
const router = express.Router();
const { createMoreAboutMe, updateMoreAboutMe, deleteMoreAboutMe, updateAboutMe } = require('../controllers/MoreAboutMeCtrl.js');
const { authMiddleware } = require("../middlewares/authMiddleware")



router.post('/update-more-about-me', updateAboutMe)

// Create More About Me
router.post('/:id', authMiddleware, createMoreAboutMe)

// Update More About Me
router.patch('/update-about-me/:id', authMiddleware, updateMoreAboutMe);

// Delete More About Me
router.delete('/delete-about-me/:id', authMiddleware, deleteMoreAboutMe);

module.exports = router;

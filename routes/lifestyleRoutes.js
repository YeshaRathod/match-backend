const express = require('express');
const router = express.Router();
const { createLifestyle, updateLifestyle, deleteLifestyle } = require('../controllers/lifestyleCtrl');
const { authMiddleware } = require("../middlewares/authMiddleware")

// Create lifestyle
router.post('/:id', authMiddleware, createLifestyle)

// Update lifestyle
router.patch('/update-lifestyle/:id', authMiddleware, updateLifestyle);

// Delete lifestyle
router.delete('/delete-lifestyle/:id', authMiddleware, deleteLifestyle);

module.exports = router;

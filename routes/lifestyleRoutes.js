const express = require('express');
const router = express.Router();
const { createLifestyle, updateLifestyle, deleteLifestyle, storeLifestyleTodb, getLifestyle } = require('../controllers/lifestyleCtrl');
const { authMiddleware } = require("../middlewares/authMiddleware")



router.post("/create-updated-lifestyle", storeLifestyleTodb)

router.post("/get-lifestyle", getLifestyle)


// Create lifestyle
router.post('/:id', authMiddleware, createLifestyle)

// Update lifestyle
router.patch('/update-lifestyle/:id', authMiddleware, updateLifestyle);

// Delete lifestyle
router.delete('/delete-lifestyle/:id', authMiddleware, deleteLifestyle);

module.exports = router;

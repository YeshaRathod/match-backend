const express = require('express');
const router = express.Router();
const { createProfile, getAllProfiles, deleteProfile, updateProfile, imageUpload } = require('../controllers/profileCtrl');
const { isAdmin, authMiddleware, isUser } = require('../middlewares/authMiddleware');
const { upload, imageUploader } = require('../middlewares/multerMiddleware');


router.post('/create-profile/:id', authMiddleware, isUser, createProfile)
router.get('/get-all-profiles', authMiddleware, isAdmin, getAllProfiles)
router.patch('/upload-image/:id', upload.single("filename"), imageUploader, imageUpload)
router.patch('/update-profile/:id', authMiddleware, isUser, updateProfile)
router.delete('/delete-profile/:id', authMiddleware, isUser, deleteProfile)



module.exports = router




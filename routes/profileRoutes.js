const express = require('express');
const router = express.Router();
const { createProfile, getAllProfiles, deleteProfile, updateProfile, imageUpload, locationStorage, languageStorage } = require('../controllers/profileCtrl');
const { isAdmin, authMiddleware, isUser } = require('../middlewares/authMiddleware');
const { upload, imageUploader } = require('../middlewares/multerMiddleware');

router.post('/location', locationStorage)
router.post('/languageStore', languageStorage)
router.post('/upload-image', upload.array("image"), imageUploader, imageUpload)

router.post('/create-profile/:id', authMiddleware, isUser, createProfile)
router.get('/get-all-profiles', authMiddleware, isAdmin, getAllProfiles)

router.patch('/update-profile/:id', authMiddleware, isUser, updateProfile)
router.delete('/delete-profile/:id', authMiddleware, isUser, deleteProfile)


module.exports = router




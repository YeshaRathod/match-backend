const express = require("express")
const router = express.Router()
const { createUser, loginUserCtrl, getAllUser, getaUser, deleteUser, updateUser, handleRefreshToken } = require('../controllers/userCtrl')
const { authMiddleware, isAdmin, isUser } = require("../middlewares/authMiddleware")
const { logout } = require('../controllers/logoutCtrl')
const { blockUser, unblockUser } = require('../controllers/blockUnblockCtrl')

//routes

//User side
router.post('/register', createUser)
router.post('/login', loginUserCtrl)
router.get('/all-users', getAllUser)



// router.post('/user', testAuth)
router.put('/edit-user/:id', authMiddleware, isUser, updateUser)
router.delete('/:id', authMiddleware, isUser, deleteUser)
router.get("/refresh/:id", authMiddleware, handleRefreshToken)
router.get('/logout/:id', authMiddleware, isUser, logout)

// admin side
// router.get('/all-users', authMiddleware, isAdmin, getAllUser)


router.get('/:id', authMiddleware, isAdmin, getaUser)
router.put('/block-user/:id', authMiddleware, blockUser)
router.put('/unblock-user/:id', authMiddleware, unblockUser)


module.exports = router
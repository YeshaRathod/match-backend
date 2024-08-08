const express = require("express")
const { createChatRoom, getAllChatsOfLoggedInUser, getChatofRoom } = require("../controllers/chatRoomCtrl")
const router = express.Router()

router.post('/create-chatroom', createChatRoom)
router.post('/get-all-chatsof-loggedin-user', getAllChatsOfLoggedInUser)
router.post('/get-chatof-room', getChatofRoom)

module.exports = router 
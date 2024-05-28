const express = require("express")
const { createChatRoom } = require("../controllers/chatRoomCtrl")
const router = express.Router()

router.post('/create-chatroom', createChatRoom)

module.exports = router 
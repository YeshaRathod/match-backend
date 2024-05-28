const asyncHandler = require("express-async-handler");
const Chatroom = require("../models/chatRoomModel");

const createChatRoom = asyncHandler(async (req, res) => {
    const { fromUserId, toUserId } = req.body;

    let chatroom = await Chatroom.findone({
        $or:
            [{
                createdById: fromUserId,
                createdBy: toUserId
            }]

    })
    if (!chatroom) {
        chatroom = new Chatroom({ createdById: fromUserId, type: 'single' });
        await chatroom.save();
    }
    res.status(200).json({ chatRoom });
})
module.exports = { createChatRoom }
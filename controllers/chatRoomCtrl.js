// const asyncHandler = require("express-async-handler");
// const Chatroom = require("../models/chatRoomModel");

// const createChatRoom = asyncHandler(async (req, res) => {
//     const { createdById } = req.body;
//     console.log(req.body)
//     try {

//         let chatroom = await Chatroom.findById({ createdById: createdById });
//         console.log(chatroom)
//         if (!chatroom) {
//             chatroom = new Chatroom({ createdById: createdById, type: 'single' });
//             await chatroom.save();
//         }
//         res.status(200).json({ chatroom });
//     } catch (error) {
//         console.log(error)
//     }
// })
// module.exports = { createChatRoom }

const asyncHandler = require("express-async-handler");
const Chatroom = require("../models/chatRoomModel");
const ChatroomMapping = require("../models/chatRoomMapping")

const { io, eventEmitter } = require('../services/socketService');
const chatServiceInstance = require("../services/Message");
const ChatService = require("../services/Message");


const createChatRoom = asyncHandler(async (req, res) => {
    const { createdById, targetUserId, message } = req.body;
    console.log("create chatroom req.body : ", req.body);

    if (!(createdById && targetUserId)) {
        // return errorResponse(res, 400, 'All input are required');
        return res.status(400).json({ message: "All input are required" })
    }
    try {
        let chatroom = await Chatroom.findOne({ createdById: createdById });
        console.log(chatroom);
        if (!chatroom) {
            chatroom = new Chatroom({ createdById: createdById });
            await chatroom.save();


            // const chatroomMappingCreatedById = await ChatroomMapping.create({ roomId: chatroom.id, memberID: createdById });
            // const chatroomMappingTargetUserId = await ChatroomMapping.create({ roomId: chatroom.id, memberID: targetUserId });

            const ChatroomMappingdata = [
                { roomId: chatroom.id, memberID: createdById },
                { roomId: chatroom.id, memberID: targetUserId }
            ]
            await ChatroomMapping.insertMany(ChatroomMappingdata);

            // console.log(chatroomMappingCreatedById);
            // console.log(chatroomMappingTargetUserId);

            // await Promise.all([chatroomMappingCreatedById.save(), chatroomMappingTargetUserId.save()]);
        }
        console.log("chatroom._id", chatroom._id);


        const chat = new ChatService()
        let newMessage = await chat.sendMessage(createdById, chatroom._id.toString(), message);
        eventEmitter("NEW_MESSAGE", chatroom._id, newMessage);
        // return successResponse(res, 201, 'Success!', { message, roomId: chatroom._id.toString() });
        return res.status(201).json({ message, roomId: chatroom._id.toString() });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = { createChatRoom };

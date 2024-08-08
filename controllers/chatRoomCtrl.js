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
    // console.log("create chatroom req.body : ", req.body);

    if (!(createdById && targetUserId)) {
        // return errorResponse(res, 400, 'All input are required');
        return res.status(400).json({ message: "All input are required" })
    }
    try {
        let chatroom = await Chatroom.findOne({ createdById: createdById });
        // console.log(chatroom);

        if (!chatroom) {
            chatroom = new Chatroom({ createdById: createdById });
        }
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

        // console.log("chatroom._id", chatroom._id);


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


const getAllChatsOfLoggedInUser = async (req, res) => {
    // const { userId } = req.body;
    const userId = req.body.createdById;
    console.log("body from getAllChatsOfLoggedInUser: ", req.body.createdById)
    console.log("getUser iD by get All chats of loggedin user :", userId);
    if (!userId) {
        return res.status(400).json({ message: "All input are required" })
    }
    try {
        // const roomIds = await ChatroomMapping.find({
        //     where: { memberID: userId },
        //     // order: [['updated_at', 'DESC']],
        //     // raw: true
        // })
        const roomIds = await ChatroomMapping.find({ memberID: userId })
            .sort({ updated_at: -1 })
            .lean();
        console.log("roomIds from getAllChatsOfLoggedInUser: ", roomIds)
        // const members = roomIds.filter((id) => id.memberId !== userId)
        // const roomIdsArr = roomIds.map((id) => id.roomId);
        const roomIdsArr = roomIds.map((id) => id.roomId.toString());
        console.log("roomIDS ARRAY :", roomIdsArr);

        const chat = new ChatService();
        const chatList = await chat.getAllChatsBySenderId(roomIdsArr);
        console.log("chat list from line 93 : ", chatList)
        // return successResponse(res, 201, 'Success!', { chatList, members: roomIds });
        return res.status(201).json({ chatList, members: roomIds });

    } catch (error) {
        console.log('error in adding Chatroom', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const sendChatMessage = async (req, res) => {
    const { senderId, message, roomId, page, limit } = req.body;
    try {
        if (!(senderId && roomId && message)) {
            return errorResponse(res, 400, 'Bad Request');
        }

        const chat = new ChatService();
        await chat.sendMessage(senderId, roomId, message);
        const messages = await chat.getChatByRoomId(roomId, page, limit);

        eventEmitter('NEW_MESSAGE', roomId, messages);

        return successResponse(res, 201, 'Success!', messages);
    } catch (error) {
        console.log('error in sending message', error);
        return errorResponse(res, 500, 'Something went wrong');
    }
}
const getChatofRoom = async (req, res) => {
    const { roomId, page, limit } = req.body;
    try {
        if (!(roomId)) {
            return errorResponse(res, 400, 'Bad Request');
        }

        const chat = new ChatService();
        const messages = await chat.getChatByRoomId(roomId, page, limit);
        return successResponse(res, 201, 'Success!', messages);
    } catch (error) {
        console.log("🚀 ~ getChatofRoom ~ error:", error)
        return errorResponse(res, 500, 'Something went wrong');
    }
}

module.exports = { createChatRoom, getAllChatsOfLoggedInUser, sendChatMessage, getChatofRoom };

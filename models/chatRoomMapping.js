const mongoose = require('mongoose');

const chatRoomMappingSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chatRoom',
        required: true
    },
    memberID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chatRoom',
        required: true
    }
}, {
    timestamps: true,
});

const ChatroomMapping = mongoose.model('Chatroommapping', chatRoomMappingSchema);
module.exports = ChatroomMapping;

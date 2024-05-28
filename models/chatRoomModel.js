const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    createdById: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        default: 'single',
        required: true
    }
});

const Chatroom = mongoose.model('Chatroom', chatRoomSchema);
module.exports = Chatroom;

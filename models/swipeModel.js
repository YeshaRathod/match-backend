const mongoose = require('mongoose');



const swipeSchema = new mongoose.Schema({
    sourceUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sourceSwipeDir: {
        type: String,
        enum: ['right', 'up'],
        required: true
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // matchDate:
    // {
    //     type: Date,
    //     default: null
    // }


});

const Swipe = mongoose.model('Swipe', swipeSchema);

module.exports = Swipe;

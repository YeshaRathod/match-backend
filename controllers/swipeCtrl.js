const asyncHandler = require("express-async-handler");
const { saveSwipeAction, checkMatch, notifyMatch, enableChat, notifyLike } = require("./SwipeActionCtrl");
const Swipe = require("../models/swipeModel");

const swipeDetails = asyncHandler(async (req, res) => {
    // console.log("swipe")
    const { sourceUserId, targetUserId, sourceSwipeDir } = req.body;

    const { success, saveSwipeID } = await saveSwipeAction(sourceUserId, targetUserId, sourceSwipeDir);      //Save the swipe action to the database
    if (success) {
        const isMatch = await checkMatch(sourceUserId, targetUserId); // Check if there's a match

        if (isMatch) { // Handle the match or like notification
            enableChat(sourceUserId, targetUserId);
        } else {
            notifyLike(targetUserId, sourceUserId);
        }

        res.json({ success: true, isMatch, saveSwipeID, targetUserId });
    } else {
        res.json({ success: false });
    }
});

const conversations = asyncHandler(async (req, res) => {
    const { sourceUserId, targetUserId } = req.body;
    console.log(sourceUserId, targetUserId);
    const conversation = await Swipe.find({ $or: [{ sourceUserId: sourceUserId, targetUserId: targetUserId }, { sourceUserId: targetUserId, targetUserId: sourceUserId }] })
    console.log(conversation)
    res.status(200).json(conversation)
})

module.exports = { swipeDetails, conversations }
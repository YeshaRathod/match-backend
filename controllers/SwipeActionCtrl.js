const Swipe = require("../models/swipeModel")

async function saveSwipeAction(sourceUserId, targetUserId, sourceSwipeDir) {
    console.log('Saving swipe action')
    try {
        const swipe = await Swipe.create({ sourceUserId, targetUserId, sourceSwipeDir })
        const saveSwipeID = swipe._id


        return { success: true, saveSwipeID, message: "Swipe details saved successfully" };
    } catch (error) {
        return { success: false, message: "Can't store swipe details." };
    }
}


async function checkMatch(sourceUserId, targetUserId) {
    console.log('Checking match')
    const match = await Swipe.findOne({ sourceUserId: targetUserId })
    console.log(match ? true : false)
    return match ? true : false;


}



function enableChat(user1, user2) {
    // Logic to enable chat between users
    console.log('Enabling chat')
}

function notifyLike(targetUserId, sourceUserId) {
    // Logic to notify the target user about the like
    console.log('Notifying like')
}


module.exports = { saveSwipeAction, checkMatch, notifyLike, enableChat }
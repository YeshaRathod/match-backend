//BLOCKING A USER

const User = require('../models/userModel')
const asyncHandler = require("express-async-handler")
const validateMongodbId = require('../utils/validateMongodbId');


const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //  validateMongodbId(id);

    try {

        const findUser = await User.findById(id)
        if (findUser) {
            if (req.user.id !== id || req.user.role === 'admin') {
                const block = await User.findByIdAndUpdate(
                    id,
                    {
                        isBlocked: true,
                    },
                    {
                        new: true
                    }
                );
                console.log(block);
                res.json({
                    message: "User Blocked"
                });
            }

            else {
                if (req.user.id === id) {
                    return res.status(403).json({ message: "You cannot block yourself" });
                }
            }
        }
        else {
            return res.status(400).json({ message: "User is not exists" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//UNBLOCK user


const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // validateMongodbId(id);
    const findUser = await User.findById(id)

    if (findUser) {

        try {
            if (req.user.id !== id || req.user.role === 'admin') {
                const unblock = await User.findByIdAndUpdate(
                    id,
                    {
                        isBlocked: false,
                    },
                    {
                        new: true
                    }
                );

                console.log(unblock);
                res.json({
                    message: "User Unblocked"
                });
            }

            else {
                if (req.user.id === id) {
                    return res.status(403).json({ message: "You cannot unblock yourself" });
                }
            }

        }
        catch (error) {
            // console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        return res.status(400).json({ message: "User is not exists" })

    }

});




module.exports = { blockUser, unblockUser }
// //logout

// const User = require('../models/userModel')
// const asyncHandler = require("express-async-handler")
// const { generateRefreshedToken } = require('../config/refreshtoken');
// const jwt = require('jsonwebtoken');


// const logout = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     console.log(req.cookies)
//     // Check if the user is logged in
//     if (req.user) {
//         // Clear the refresh token from the user document
//         await User.findByIdAndUpdate(id, { refreshToken: "" });
//         res.clearCookie("refreshToken");
//         return res.sendStatus(204); // No content - successful logout
//     } else {
//         // User is not logged in
//         return res.status(401).json({ message: "You are already logged out" });
//     }
// });

// module.exports = { logout };










// const logout = asyncHandler(async (req, res) => {
//     const cookie = req.cookies
//     if (!cookie?.refreshToken) throw new Error("no Refresh token in cookies")
//     const refreshToken = cookie.refreshToken;
//     const user = await User.findOne({ refreshToken })
//     if (!user) {
//         res.clearCookie("refreshToken", {
//             httpOnly: true,
//             secure: true,
//         })
//         return res.sendStatus(204)
//     }
//     await User.findOneAndUpdate(refreshToken, {
//         refreshToken: "",
//     })
//     res.clearCookie("refreshToken", {
//         httpOnly: true,
//         secure: true,
//     })
//     return res.sendStatus(204)
// })


// module.exports = { logout }


const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const validateMongodbId = require('../utils/validateMongodbId');

const logout = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cookie = req.cookies;

    // validateMongodbId(id)

    // const decodedUserId = req.user.id;
    // if (id !== decodedUserId) {
    //     return res.status(403).json({ message: 'You are not authorized to logout from this profile' });
    // }

    if (!cookie?.refreshToken) throw new Error("No Refresh token in cookies because you are already logged out");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ _id: id, refreshToken });

    // if (!user) {
    //     res.clearCookie("refreshToken");
    //     return res.sendStatus(204);
    //     //  console.log("hello")
    // }

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "You are successfully logged out" });
});


module.exports = { logout };

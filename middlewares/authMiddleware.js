const User = require('../models/userModel')
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler");
const validateMongodbId = require('../utils/validateMongodbId');


const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        //  console.log(token)
        try {
            if (!token) {
                return res.status(401).json({ message: "You are not authenticated!" });
            }
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) return res.status(403).json({ message: "Token is not valid!" })
                // console.log(user);
                req.user = user;
                next()
            })
        }
        catch (error) {
            // console.log(error);
            throw new Error("Not Authorized. Token might be expired or invalid.");
        }
    } else {
        return res.status(401).json({ message: 'There is no token attached to Header' })
    }
});

// IS User

const isUser = asyncHandler(async (req, res, next) => {
    const user_id = req.params.id
    // console.log(user_id)
    if (user_id) {
        const findUser = await User.findById(user_id)
        //   console.log(findUser)
        if (!findUser) {
            return res.status(404).json({ message: "User Doesnot exists in dtabase" })
        }
    }
    if (req.user.id === user_id) {
        next();
    } else {
        return res.status(403).json({ message: "You are not VALID USER! please check Token" })
    }
})



//Is ADMIN

const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const id = req.user.id
        if (id) {
            const user = await User.findById(id)
            if (user.role === "admin") {
                next()
            } else {
                return res.status(403).json({ message: "you are not admin" })
            }
        }
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: 'Forbidden, you are not admin' });
    }
});




module.exports = { authMiddleware, isAdmin, isUser }










// import { createError } from "../utils/error.js";

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.access_token;
//     if (!token) {
//         return next(createError(401, "You are not authenticated!"));
//     }

//     jwt.verify(token, process.env.JWT, (err, user) => {
//         if (err) return next(createError(403, "Token is not valid!"));
//         console.log(user);
//         req.user = user;
//         next();
//     });
// };

// export const verifyUser = (req, res, next) => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//         next();
//     } else {
//         return next(createError(403, "You are not authorized!"));
//     }
// };

// export const verifyAdmin = (req, res, next) => {
//     if (req.user.isAdmin) {
//         next();
//     } else {
//         return next(createError(403, "You are not authorized!"));
//     }
// };
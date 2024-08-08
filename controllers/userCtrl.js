const User = require('../models/userModel')
const asyncHandler = require("express-async-handler")
const { generateToken } = require('../config/jwtToken')
const validateMongodbId = require('../utils/validateMongodbId');
const { generateRefreshedToken } = require('../config/refreshtoken');
const jwt = require('jsonwebtoken');
const Lifestyle = require('../models/lifestyleModel');
const MoreAboutMe = require('../models/moreAboutMeModel');
const Profile = require('../models/profileModel')


const createUser = asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email })

    try {

        if (!findUser) {
            //create a new user
            const newUser = await User.create(req.body)
            const token = generateToken(newUser._id)
            return res.status(201).json({
                token: token,
                user: newUser
            })
        }
        else {
            return res.status(409).json({ message: "User already exists" })
        }
    }
    catch (error) {
        // next(error)
        console.log(error)
        return res.status(409).json({ message: error })
    }
})


//login controller
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const findUser = await User.findOne({ email })
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshedToken(findUser?.id)
        const updateToken = await User.findByIdAndUpdate(
            findUser?.id,
            {
                refreshToken: refreshToken,
            },
            {
                new: true
            })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            name: findUser?.name,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        })
        // console.log(_id, _name, email, mobile, token)
    }
    else {
        return res.status(401).send({ message: "Invalid Email or Password" })
    }
})

const getAllUser = asyncHandler(async (req, res) => {
    // console.log("hello")
    try {
        const count = await User.countDocuments();
        const users = await User.aggregate([{ $sample: { size: count } }]);
        res.status(200).json(users);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "can't get all profiles due to some Internal server error" })
    }
})


const getAllTargetUser = asyncHandler(async (req, res) => {

    const loggedInUserId = req.body.userId;
    try {
        const count = await User.countDocuments({ _id: { $ne: loggedInUserId } });
        const users = await User.find({ _id: { $ne: loggedInUserId } });
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        const shuffledUsers = shuffleArray(users);

        //user images
        const userProfiles = await Profile.find({
            user_id: { $in: shuffledUsers.map(user => user._id) }
        });

        // console.log(userProfiles)
        const usersWithProfiles = shuffledUsers.map(user => {
            const profile = userProfiles.find(p => p.user_id.toString() === user._id.toString());
            return {
                ...user.toObject(),
                images: profile ? profile.profile_picture : []
            };
        });

        // console.log(usersWithProfiles)

        res.status(200).json(usersWithProfiles);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "can't get all profiles due to some Internal server error" })
    }
})

//get a single user by ID

const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    //  validateMongodbId(id)
    // const decodedUserId = req.params.id;
    // if (id !== decodedUserId) {
    //     return res.status(403).json({ message: 'You are not authorized to view this profile' });
    // }
    //  console.log(req.params)
    const getaUser = await User.findById(id);
    try {
        if (getaUser) {

            return res.status(200).json(getaUser)
        } else {
            return res.status(404).json({ message: "User is not exists in database" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }

})


// delete a single user

const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const profile = await Profile.findOne({ user_id: id });
        if (profile) {
            await Profile.findByIdAndDelete(profile._id)
            await MoreAboutMe.findOneAndDelete({ user_id: id });
            await Lifestyle.findOneAndDelete({ user_id: id });
        }
        await User.findByIdAndDelete(id);

        res.status(200).json({ mesage: "User deleted successfully", deleteUser })
    } catch (error) {
        return res.status(500).json({ message: "user cannot deleted because of internal server error" })
    }

})

///handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cookie = req.cookies;
    console.log(cookie)
    //  validateMongodbId({ id })
    if (!cookie?.refreshToken) {
        throw new Error('No Refresh Token in cookie');
    }
    const decodedUserId = req.user.id;
    if (id !== decodedUserId) {
        return res.status(403).json({ message: 'You are not authorized to refreshtoken' });
    }
    const refreshToken = cookie.refreshToken;
    console.log(id)
    const user = await User.findById(id);
    // console.log(user)
    if (!user) {
        return res.status(401).json({ message: "user id is not valid" });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        } else {
            const accessToken = generateToken(user.id);
            return res.json({ accessToken });
        }
    });
});



// const handleRefreshToken = asyncHandler(async (req, res) => {
//     const cookie = req.cookies;
//     console.log(cookie)
//     if (!cookie?.refreshToken) throw new Error('No Refresh Token in cookie')
//     const refreshToken = cookie.refreshToken;
//     console.log(refreshToken);
//     const user = await User.findOne({ refreshToken });
//     if (!user) throw new Error('No refresh token present in db or not matched')
//     jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
//         // console.log(decoded)
//         if (err || user.id !== decoded.id) {
//             throw new Error("there is something wrong with refresh token")
//         }
//         else {
//             const accessToken = generateToken(user?.id)
//             res.json({ accessToken })
//         }
//     })
//     res.json(user)

// })


//update a user using put request

const updateUser = asyncHandler(async (req, res) => {
    // console.log(req.params)
    const id = req.params.id
    //validateMongodbId({ id })
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            name: req?.body?.name,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            password: req?.body?.password
        },
            {
                new: true
            });
        res.json({ updateUser })
    } catch (error) {
        console.log(error)
    }

})


// const testAuth = asyncHandler(async (req, res) => {
//     const { email } = req.body
//     //console.log(email)
//     try {
//         const findUser = await User.findOne({ email })
//         //  console.log(findUser)
//         if (!email) {
//             return res.status(400).json({ message: "EmailId is required" })
//         }
//         if (findUser) {
//             const deleteUser = await User.findOneAndDelete({ email })
//             //  console.log(deleteUser)
//             return res.status(200).json({ message: "user deleted successfully" })
//         }
//         else {
//             const createUser = await User.create(req.body)
//             return res.status(200).json({ message: "User created successfully" })
//             // console.log(createUser)
//         }
//     } catch (error) {
//         console.log(error)
//     }
// })

module.exports = {
    createUser,
    loginUserCtrl,
    getAllUser,
    getaUser,
    deleteUser,
    updateUser,
    handleRefreshToken, getAllTargetUser
}
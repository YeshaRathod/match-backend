const multer = require("multer")
const Profile = require("../models/profileModel")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/my-uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage })

const { v2 } = require("cloudinary");

v2.config({
    cloud_name: 'drujwhndz',
    api_key: '473926636931857',
    api_secret: "nRHGPOQalq-0ph2h5uSv4KbwTbw"
});

const asyncHandler = require("express-async-handler");


const imageUploader = asyncHandler(async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const response = await v2.uploader.upload(req.file.path, {
            resource_type: "image"
        });
        // console.log(response.url)
        req.cloudinaryImageUrl = response.url
        const image = response.url
        console.log(image)
        const { user_id } = req.body
        const userId = req.params.id;
        const profile = await Profile.findOneAndUpdate({ user_id: userId });
        if (profile) {
            profile.profile_picture = image
            console.log(profile)
            await profile.save()
            return res.status(200).json({ message: "Photo upload successfully" })
        }
        else {
            console.log("error")
            return res.status(400).json({ message: "Photo didnot upload successfully" })
        }
        next();
        // console.log(response.url)
    } catch (error) {
        console.log(error)
    }
})


module.exports = { upload, imageUploader }
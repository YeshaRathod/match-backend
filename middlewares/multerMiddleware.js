// const multer = require("multer")
// const Profile = require("../models/profileModel")

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/my-uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })

// const upload = multer({ storage })

// const { v2 } = require("cloudinary");

// v2.config({
//     cloud_name: 'drujwhndz',
//     api_key: '473926636931857',
//     api_secret: "nRHGPOQalq-0ph2h5uSv4KbwTbw"
// });

// const asyncHandler = require("express-async-handler");


// // const imageUploader = asyncHandler(async (req, res, next) => {
// //     try {

// //         const multipleImages = req.files
// //         if (!multipleImages) {
// //             return res.status(400).json({ message: "No file uploaded" });
// //         }
// //         const ImageUrls = []
// //         for (const image of multipleImages) {
// //             const result = await v2.uploader.upload(image.path, {
// //                 resource_type: "auto"
// //             })
// //             ImageUrls.push(result.secure_url)
// //         }
// //         req.multipleImages = ImageUrls

// //         // const response = await v2.uploader.upload(req.file.path, {
// //         //     resource_type: "image"
// //         // });
// //         // console.log(response.url)
// //         req.cloudinaryImageUrl = result.url
// //         const image = result.url
// //         console.log(image)
// //         const { user_id } = req.body
// //         const userId = req.params.id;
// //         const profile = await Profile.findOneAndUpdate({ user_id: userId });
// //         if (profile) {
// //             profile.profile_picture = ImageUrls
// //             console.log(profile)
// //             await profile.save()
// //             return res.status(200).json({ message: "Photo upload successfully" })
// //         }
// //         else {
// //             console.log("error")
// //             return res.status(400).json({ message: "Photo didnot upload successfully" })
// //         }
// //         next();
// //         // console.log(response.url)
// //     } catch (error) {
// //         console.log(error)
// //     }
// // })

// const imageUploader = asyncHandler(async (req, res, next) => {
//     try {
//         const multipleImages = req.files;
//         if (!multipleImages || multipleImages.length === 0) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         const imageUrls = [];
//         for (const image of multipleImages) {
//             const result = await v2.uploader.upload(image.path, {
//                 resource_type: "auto"
//             });
//             imageUrls.push(result.secure_url);
//         }

//         const userId = req.params.id;
//         const profile = await Profile.findOneAndUpdate({ user_id: userId });
//         if (profile) {
//             profile.profile_picture = imageUrls;
//             await profile.save();
//             return res.status(200).json({ message: "Photos uploaded successfully" });
//         } else {
//             return res.status(404).json({ message: "User profile not found" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });




// module.exports = { upload, imageUploader }

const multer = require("multer");
const Profile = require("../models/profileModel");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/my-uploads');
    },
    image: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const { v2 } = require("cloudinary");

v2.config({
    cloud_name: 'drujwhndz',
    api_key: '473926636931857',
    api_secret: "nRHGPOQalq-0ph2h5uSv4KbwTbw"
});

const asyncHandler = require("express-async-handler");

const imageUploader = asyncHandler(async (req, res) => {
    try {

        const user_id = req.body.userId; // Access userId from req.body
        // console.log("userID :", user_id);
        const multipleImages = req.files
        // console.log(multipleImages)
        if (!multipleImages) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const ImageUrls = []
        for (const image of multipleImages) {
            const result = await v2.uploader.upload(image.path, {
                resource_type: "auto"
            })
            ImageUrls.push(result.url)
        }
        req.multipleImages = ImageUrls
        console.log("Images urls :", ImageUrls)

        const userProfile = await Profile.findOne({ user_id: user_id });
        console.log("user profile  :", userProfile)
        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }
        userProfile.profile_picture = req.multipleImages;
        await userProfile.save();

        return res.status(200).json({ message: "images uploaded successfully", images: ImageUrls })
    } catch (error) {
        console.log("error from image upload backend ", error)
    }


});

module.exports = { upload, imageUploader };

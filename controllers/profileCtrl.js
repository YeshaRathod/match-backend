const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const Profile = require("../models/profileModel")
const MoreAboutMe = require('../models/moreAboutMeModel');
const LifeStyle = require('../models/lifestyleModel');
const validateMongodbId = require('../utils/validateMongodbId');

const createProfile = asyncHandler(async (req, res) => {
    const { user_id } = req.body
    const decodedUserId = req.user.id;
    // console.log(decodedUserId)
    // console.log(user_id)
    if (user_id !== decodedUserId) {
        return res.status(400).json({ message: 'Give Valid user_id for creating profile' });
    }
    const { birthdate, gender, preference_gender, more_about_me, lifestyle } = req.body;
    // console.log(user_id, birthdate, gender, preference_gender, more_about_me, lifestyle)
    try {
        const existingProfile = await Profile.findOne({ user_id });

        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists' });
        }
        const user = await User.findById(user_id);
        // console.log("user", user);
        if (user_id) {
            const moreaboutme = await MoreAboutMe.create({ user_id, ...more_about_me });
            const life_style = await LifeStyle.create({ user_id, ...lifestyle });
            if (moreaboutme._id && life_style._id) {
                //   console.log({ user_id: user_id, moreAboutMe_id: moreaboutme._id, lifestyle_id: life_style._id });
                await Profile.create({
                    user_id: user_id,

                    birthdate: birthdate,
                    gender: gender,
                    preference_gender: preference_gender,
                    //  profile_picture: req.cloudinaryImageUrl,
                    moreAboutMe_id: moreaboutme._id,
                    lifestyle_id: life_style._id
                })
                //    console.log(Profile)
                res.status(201).json({ message: 'Profile created successfully!' });
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "there is something wrong in data" })
    }
})


const getAllProfiles = asyncHandler(async (req, res) => {

    try {
        const getProfiles = await Profile.find()
        res.status(200).json(getProfiles)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "can't get all profiles due to some Internal server error" })
    }
})

// get a single profile by id

const getProfile = asyncHandler(async (req, res) => {
    const user_id = req.params.id;
    // console.log(user_id)
    //  const findUser = await User.findById(id);
    // console.log(findUser)
    validateMongodbId(user_id)
    try {
        const profile = await Profile.findOne({ user_id });
        // console.log(profile)
        if (!profile) {
            return res.status(404).json({ message: "Profile not found for the given user ID in database" });
        }

        // If profile is found, return it
        res.status(200).json({ message: "Profile retrieved successfully", profile });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "cann't get a profile due to some internal error" })
    }
})

// Delete a single profile
const deleteProfile = asyncHandler(async (req, res) => {
    const userIdToDelete = req.params.id;
    const requestingUserId = req.user.id;
    // console.log(userIdToDelete)
    try {
        //  const userIdToDeleteObjectId = mongoose.Types.ObjectId(userIdToDelete);
        const profile = await Profile.findOne({ user_id: userIdToDelete });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found for the given user ID in database" });
        }
        if (userIdToDelete !== requestingUserId) {
            return res.status(403).json({ message: 'You are not authorized to delete this profile' });
        }

        // Delete the profile and associated documents
        await Profile.findOneAndDelete({ user_id: userIdToDelete });
        await MoreAboutMe.findOneAndDelete({ user_id: userIdToDelete });
        await LifeStyle.findOneAndDelete({ user_id: userIdToDelete });

        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "give valid user id." });
    }
});


const updateProfile = asyncHandler(async (req, res) => {
    const { user_id, birthdate, gender, preference_gender } = req.body
    const userId = req.params.id;
    const decodedUserId = req.user.id;

    // validateMongodbId(userId); // Validate user 
    if (user_id !== decodedUserId) {
        return res.status(400).json({ message: 'Give Valid user_id for update profile' });
    }
    try {
        const profile = await Profile.findOne({ user_id: userId });
        //console.log(profile)
        if (!profile) {
            return res.status(404).json({ message: "Profile not found for the given user ID" });
        }
        if (birthdate !== undefined) {
            profile.birthdate = birthdate;
        }
        if (gender) {
            profile.gender = gender;
        }
        if (preference_gender) {
            profile.preference_gender = preference_gender;
        }

        // if (!profile_picture) {
        //     console.log("hello")
        // }
        await profile.save();

        if (req.body.more_about_me) {
            const moreAboutMe = await MoreAboutMe.findOneAndUpdate({ user_id: userId }, req.body.more_about_me, { new: true });
            if (!moreAboutMe) {
                return res.status(404).json({ message: "MoreAboutMe document not found for the given user ID" });
            }
        }
        if (req.body.lifestyle) {
            const lifestyle = await LifeStyle.findOneAndUpdate({ user_id: userId }, req.body.lifestyle, { new: true });
            if (!lifestyle) {
                return res.status(404).json({ message: "Lifestyle document not found for the given user ID" });
            }
        }
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


const imageUpload = asyncHandler(async (req, res) => {
    console.log("image uploaded")
})




const locationStorage = asyncHandler(async (req, res) => {
    const { userId, latitudee, longitudee, birthdate, gender, preferedgender } = req.body;
    // console.log(userId, latitudee, longitudee, birthdate, gender, preferedgender)
    try {
        const profile = await Profile.findOneAndUpdate({ user_id: userId }, { $setOnInsert: { user_id: userId } },
            { upsert: true, new: true });
        // console.log(profile)
        if (profile) {
            profile.user_id = userId;
            profile.latitude = latitudee;
            profile.longitude = longitudee;
            profile.birthdate = birthdate;
            profile.gender = gender;
            profile.preference_gender = preferedgender;
            await profile.save();
            res.status(200).json({ message: "Location updated successfully" });
        } else {
            res.status(404).json({ message: "Profile not found" });
        }
    } catch (error) {
        console.error("Error storing temp data :", error);
        res.status(500).json({ message: "Internal server error" });
    }


});

const languageStorage = asyncHandler(async (req, res) => {
    const { userId, languages } = req.body;
    console.log(req.body);

    try {
        // Update the profile by its MongoDB _id
        // const profile = await Profile.findByIdAndUpdate(
        //     userId,
        //     { languages: languages },
        //     { new: true, upsert: true }
        // );

        const profile = await Profile.findOneAndUpdate({ userId: userId });
        // console.log(profile);
        if (profile) {
            profile.languages = languages;
            await profile.save();
            res.status(200).json({ message: "Languages updated successfully" });
        }

        // if (profile) {

        // } 
        else {
            res.status(404).json({ message: "Profile not found" });
        }
    } catch (error) {
        console.error("Error storing languages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});







// const locationStorage = asyncHandler(async (req, res) => {
//     const { userId, latitude, longitude } = req.body;
//     // console.log(userId)
//     try {
//         const profile = await Profile.findOneAndUpdate({ user_id: userId }, { $setOnInsert: { user_id: userId } },
//             { upsert: true, new: true });
//         // console.log(profile)
//         if (profile) {
//             profile.user_id = userId;
//             profile.latitude = latitude;
//             profile.longitude = longitude;
//             await profile.save();
//             res.status(200).json({ message: "Location updated successfully" });
//         } else {
//             res.status(404).json({ message: "Profile not found" });
//         }
//     } catch (error) {
//         console.error("Error updating location:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });



module.exports = { createProfile, getAllProfiles, getProfile, deleteProfile, updateProfile, imageUpload, locationStorage, languageStorage };



















// deleting profile


// const deleteProfile = asyncHandler(async (req, res) => {
//     const { user_id } = req.body // Extract user_id from params directly
//     const decodedUserId = req.user.id;
//     const userId = req.params.id

//     // validateMongodbId({ user_id }); // Validate user ID
//     // console.log(req.params.id);
//     // console.log(decodedUserId);

//     try {
//         const profile = await Profile.findOne({ user_id: userId });

//         if (!profile) {
//             return res.status(404).json({ message: "Profile not found for the given user ID" });
//         }
//         if (user_id !== decodedUserId) {
//             return res.status(403).json({ message: 'You are not authorized to delete this profile' });
//         }

//         // Find the profile using the user ID and delete it
//         await Profile.findOneAndDelete({ user_id: user_id });
//         await MoreAboutMe.findOneAndDelete({ user_id: user_id });
//         await LifeStyle.findOneAndDelete({ user_id: user_id });

//         res.status(200).json({ message: "Profile deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Unable to delete profile due to internal server error" });
//     }
// });

// const deleteProfile = asyncHandler(async (req, res) => {
//     const { user_id } = req.params.id
//     const decodedUserId = req.user.id;

//     // validateMongodbId({ user_id }); // Validate user ID
//     console.log(req.params.id)
//     console.log(decodedUserId)


//     try {
//         if (user_id !== decodedUserId) {
//             return res.status(403).json({ message: 'You are not authorized to delete this profile' });
//         }
//         // Find the profile using the user ID and delete it
//         await Profile.findOneAndDelete({ user_id: userId });
//         await MoreAboutMe.findOneAndDelete({ user_id: userId });
//         await LifeStyle.findOneAndDelete({ user_id: userId });


//         res.status(200).json({ message: "Profile deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Unable to delete profile due to internal server error" });
//     }
// });

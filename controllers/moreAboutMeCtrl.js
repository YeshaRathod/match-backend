const MoreAboutMe = require('../models/moreAboutMeModel');
const asyncHandler = require("express-async-handler");
const User = require('../models/userModel')
const validateMongodbId = require('../utils/validateMongodbId');
const moreAboutMeModel = require('../models/moreAboutMeModel');

// Create More About Me
const createMoreAboutMe = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        validateMongodbId({ id })
        const decodedUserId = req.user.id;
        console.log(id)
        console.log(decodedUserId)

        if (id !== decodedUserId) {
            return res.status(403).json({ message: 'You are not authorized to create this profile' });
        }
        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // const existingProfile = await MoreAboutMe.findOne({ user_id: id });
        // if (!existingProfile) {
        //     return res.status(400).json({ message: 'Profile already exists' });

        // }


        // User exists, proceed to create/update MoreAboutMe details
        const { zodiac, education, family_plans, covid_vaccine, personality_type, communication_style, love_style } = req.body;

        // Create/Update MoreAboutMe details
        const newAboutMe = await MoreAboutMe.findOneAndUpdate(
            { user_id: id }, // Find MoreAboutMe document by user_id
            {
                user_id: id,
                zodiac,
                education,
                family_plans,
                covid_vaccine,
                personality_type,
                communication_style,
                love_style
            },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: "More About User's data created successfully", data: newAboutMe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'More About me is not created because of Internal Server Error' });
    }
});



// Update More About Me
const updateMoreAboutMe = asyncHandler(async (req, res) => {
    try {
        // const { id } = req.params;
        // validateMongodbId(id);
        const id = req.params.id;
        validateMongodbId({ id });
        const decodedUserId = req.user.id;
        console.log(decodedUserId)
        if (id !== decodedUserId) {
            return res.status(403).json({ message: 'You are not authorized to update this profile' });
        }
        // Find the MoreAboutMe document associated with the user ID
        const moreAboutMe = await MoreAboutMe.findOne({ user_id: id });

        if (!moreAboutMe) {
            return res.status(404).json({ message: 'MoreAboutMe data not found for the user' });
        }

        // Update the MoreAboutMe details with the provided data from the request bodyq
        moreAboutMe.zodiac = req?.body?.zodiac || moreAboutMe.zodiac;
        moreAboutMe.education = req?.body?.education || moreAboutMe.education;
        moreAboutMe.family_plans = req?.body?.family_plans || moreAboutMe.family_plans;
        moreAboutMe.covid_vaccine = req?.body?.covid_vaccine || moreAboutMe.covid_vaccine;
        moreAboutMe.personality_type = req?.body?.personality_type || moreAboutMe.personality_type;
        moreAboutMe.communication_style = req?.body?.communication_style || moreAboutMe.communication_style;
        moreAboutMe.love_style = req?.body?.love_style || moreAboutMe.love_style;

        // Save the updated MoreAboutMe document
        const updatedMoreAboutMe = await moreAboutMe.save();

        res.status(200).json({ message: 'MoreAboutMe data updated successfully', updatedMoreAboutMe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Delete More About Me
const deleteMoreAboutMe = asyncHandler(async (req, res) => {
    const user_id = req.params.id; // Extract user_id from params directly
    const decodedUserId = req.user.id;
    try {
        if (user_id !== decodedUserId) {
            return res.status(403).json({ message: 'You are not authorized to delete this profile' });
        }
        const deletedMoreAboutMe = await MoreAboutMe.findOneAndDelete({ user_id: user_id });

        if (!deletedMoreAboutMe) {
            return res.status(404).json({ message: 'MoreAboutMe data not found for the user' });
        }

        res.status(200).json({ message: 'MoreAboutMe data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});





//-------------------------storing data to databse------------------------

const updateAboutMe = asyncHandler(async (req, res) => {
    const { userId, zodiac, education, family_plans, covid_vaccine, personality_type, communication_style, love_style } = req.body
    console.log(userId, zodiac, education, family_plans, covid_vaccine, personality_type, communication_style, love_style)
    try {
        const moreaboutme = await MoreAboutMe.findOneAndUpdate({ user_id: userId }, { $setOnInsert: { user_id: userId } },
            { upsert: true, new: true })
        if (moreaboutme) {
            moreaboutme.user_id = userId,
                moreaboutme.zodiac = zodiac,
                moreaboutme.education = education,
                moreaboutme.family_plans = family_plans,
                moreaboutme.covid_vaccine = covid_vaccine,
                moreaboutme.personality_type = personality_type,
                moreaboutme.communication_style = communication_style,
                moreaboutme.love_style = love_style,

                await moreaboutme.save();
            res.status(200).json({ message: "More about me saved to database successfully" });
        }
        else {
            res.status(404).json({ message: "More about me not saved to database" });
        }

    } catch (error) {
        console.log("error comes from Moreabout me controller MoreAboutMe", error)
    }
})

module.exports = { createMoreAboutMe, updateMoreAboutMe, deleteMoreAboutMe, updateAboutMe };
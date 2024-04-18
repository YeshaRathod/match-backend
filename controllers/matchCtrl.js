const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const MoreAboutMe = require('../models/moreAboutMeModel');
const Lifestyle = require('../models/lifestyleModel');
const validateMongodbId = require('../utils/validateMongodbId');
const Profile = require('../models/profileModel');

const getFilteredData = asyncHandler(async (req, res) => {
    try {
        let query = req.query;
        let filter = {};

        let lookupStage = {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'users'
        };
        if (query.preference_gender) {
            filter.gender = query.preference_gender;
        }
        if (query.age) {
            filter.age = parseInt(query.age);
        }
        let minAge, maxAge;
        if (query.ageRange) {
            [minAge, maxAge] = query.ageRange.split('-').map(Number);
            filter.age = { $gte: minAge, $lte: maxAge };
        }
        let pipeline = [
            { $lookup: lookupStage },
            { $match: filter },
            {
                $match: {
                    users: {
                        $elemMatch: {
                            name: { $regex: query.search || "", $options: 'i' }
                        }
                    }
                }
            },
        ];
        // const mydata = await Profile.find({})
        // console.log(pipeline);
        const mydata = await Profile.aggregate(pipeline);
        // console.log(filter)
        // res.status(200).json)
        console.log(mydata)
        if (mydata.length == 0) {
            return res.status(404).json({ message: "There is no data for this Query" })
        }
        res.status(200).json(mydata)




    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



const matchProfiles = asyncHandler(async (req, res) => {

    const { sourceUserId, targetUserId } = req.body;
    try {
        validateMongodbId(sourceUserId)
        validateMongodbId(targetUserId)
        // console.log("id valid")
    } catch (error) {
        console.error(error)
        res.status(404).json({ message: "ID is not valid", error })
    }

    const sourceUser = await User.findById(sourceUserId)
    const targetUser = await User.findById(targetUserId)

    //more about me
    const sourceMoreAboutMe = await MoreAboutMe.findOne({
        user_id: sourceUserId
    })
    const targetMoreAboutMe = await MoreAboutMe.findOne({
        user_id: targetUserId
    })

    //lifestyle
    const sourceLifestyle = await Lifestyle.findOne({
        user_id: sourceUserId
    })
    const targetLifestyle = await Lifestyle.findOne({
        user_id: targetUserId
    })



    //interation
    let matchCount = 1

    const skm = Object.keys(sourceMoreAboutMe._doc)
    const tkm = Object.keys(targetMoreAboutMe._doc)
    const skl = Object.keys(sourceLifestyle._doc)
    const tkl = Object.keys(targetLifestyle._doc)

    const sourcekeysM = skm.slice(2, 8)
    const targetkeysM = tkm.slice(2, 8)
    const sourcekeysL = skl.slice(2, 8)
    const targetkeysL = tkl.slice(2, 8)

    sourcekeysL.forEach(fieldName => {
        if (targetkeysL.includes(fieldName)) {
            const sourceValueL = sourceLifestyle._doc[fieldName];
            const targetValueL = targetLifestyle._doc[fieldName];
            if (sourceValueL === targetValueL) {
                matchCount++;
            }
        }
        else {
            console.log("failed,  Error in lifestyle loop")
            res.send("error in Lifestyle loop")
        }
    })

    sourcekeysM.forEach(fieldName => {
        if (targetkeysM.includes(fieldName)) {
            const sourceValueM = sourceMoreAboutMe._doc[fieldName];
            const targetValueM = targetMoreAboutMe._doc[fieldName];
            if (sourceValueM === targetValueM) {
                matchCount++;
            }
        }
        else {
            console.log("faied, error in more about me loop")
            res.send("error in about me loop")
        }
    })
    console.log(matchCount)

    try {
        const isMatched = matchCount >= 4
        res.status(200).json({ message: isMatched ? "Matched" : "Not Matched" });

    } catch (error) {
        console.error('Error matching profiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = { getFilteredData, matchProfiles };

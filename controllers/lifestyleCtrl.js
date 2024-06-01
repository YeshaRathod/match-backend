const asyncHandler = require("express-async-handler");
const User = require('../models/userModel')
const validateMongodbId = require('../utils/validateMongodbId');
const Lifestyle = require('../models/lifestyleModel');


const createLifestyle = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const decodedUserId = req.user.id;
        //  console.log(decodedUserId)
        if (id !== decodedUserId) {
            return res.status(403).json({ message: 'You are not authorized to create this profile plz check your id or token' });
        }
        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        // const existingProfile = await Lifestyle.findOne({ decodedUserId });
        // if (!existingProfile) {
        //     return res.status(400).json({ message: 'Profile already exists' });

        // }
        const { pets, drinking, smoke, workout, dietary_preference, sleeping_habits } = req.body;
        const newLifestyle = await Lifestyle.findOneAndUpdate(
            { user_id: id },
            {
                user_id: id,
                pets,
                drinking,
                smoke,
                workout,
                dietary_preference,
                sleeping_habits
            },
            { upsert: true, new: true }
        );
        res.status(200).json({ message: "User's Lifestyle created successfully", data: newLifestyle })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Lifestyle of user cannot created because of Internal server error" })
    }

})

const updateLifestyle = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        validateMongodbId({ id });
        const decodedUserId = req.user.id;
        console.log(decodedUserId)
        if (id !== decodedUserId) {
            return res.status(403).json({ message: 'You are not authorized to update this profile' });
        }
        // Find the Lifestyle document associated with the user ID
        const lifestyle = await Lifestyle.findOne({ user_id: id });
        //        console.log(lifestyle)

        if (!lifestyle) {
            return res.status(404).json({ message: "Lifestyle data not found." });
        }

        // Update the Lifestyle details with the provided data from the request body
        const updateFields = ['pets', 'drinking', 'smoke', 'workout', 'dietary_preference', 'sleeping_habits'];
        updateFields.forEach(field => {
            lifestyle[field] = req?.body?.[field] || lifestyle[field];
        });

        // Save the updated Lifestyle document
        const updatedLifestyle = await lifestyle.save();

        res.status(200).json({ message: 'Lifestyle data updated successfully', updatedLifestyle });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lifestyle can't update because of internal server error" });
    }
});


const deleteLifestyle = asyncHandler(async (req, res) => {
    try {
        // const { id } = req.params;
        // validateMongodbId(id)
        const id = req.params.id
        const decodedUserId = req.user.id;
        console.log(decodedUserId)
        if (id !== decodedUserId) {
            return res.status(403).json({ message: 'You are not authorized to delete this profile plz check your id' });
        }

        const deletedLifestyle = await Lifestyle.findOneAndDelete({ user_id: id })

        if (!deletedLifestyle) {
            return res.status(404).json({ message: "Lifestyle data not found for the user." })
        }
        res.status(200).json({ message: "Lifestyle data deleted successfully" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

//---------------------------------storing data to databse--------------------------------

const storeLifestyleTodb = asyncHandler(async (req, res) => {
    const { userId, pets, drinking, smoke, workout, dietary_preference, sleeping_habits } = req.body
    console.log(userId, pets, drinking, smoke, workout, dietary_preference, sleeping_habits)
    try {
        const lifestyle = await Lifestyle.findOneAndUpdate({ user_id: userId }, { $setOnInsert: { user_id: userId } },
            { upsert: true, new: true })
        if (lifestyle) {
            lifestyle.user_id = userId,
                lifestyle.pets = pets,
                lifestyle.drinking = drinking,
                lifestyle.smoke = smoke,
                lifestyle.workout = workout,
                lifestyle.dietary_preference = dietary_preference,
                lifestyle.sleeping_habits = sleeping_habits,


                await lifestyle.save();


            res.status(200).json({ message: "lifestyle saved to database successfully" });
        }
        else {
            res.status(404).json({ message: "lifestyle not saved to database" });
        }

    } catch (error) {
        console.log("error comes from lifestyle controller", error)
    }
})

const getLifestyle = asyncHandler(async (req, res) => {
    const { userId } = req.body; // Assuming userId is passed as a route parameter
    console.log(userId)
    try {
        const lifestyle = await Lifestyle.findOne({ user_id: userId });
        console.log(lifestyle)
        if (lifestyle) {
            res.status(200).json(lifestyle);
        } else {
            res.status(404).json({ message: "lifestyle not found for this user" });
        }
    } catch (error) {
        console.error("Error fetching lifestyle data", error);
        res.status(500).json({ message: "Intern al Server Error" });
    }
});


module.exports = { createLifestyle, updateLifestyle, deleteLifestyle, storeLifestyleTodb, getLifestyle }
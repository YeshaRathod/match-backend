const mongoose = require('mongoose');

const lifestyleSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pets: {
        type: String,
        enum: ['Dog', 'Cat', 'Replite', 'Bird', 'Fish', "Don't have, but love", 'Turtle', 'Rabbit', 'Pet-free', 'All the pets', 'Want a pet', 'Allergic to pets', 'Other']
    },
    drinking: {
        type: String,
        enum: ['Not for me', 'Socially, at the weekend', 'On special Occasions', 'Newly teetotal', 'Most nights']
    },
    smoke: {
        type: String,
        enum: ['Smoker', 'Social smoker', 'Smoker when drinking', 'Non-smoker', 'Trying to quit']
    },
    workout: {
        type: String,
        enum: ['Everyday', 'Often', 'Sometimes', 'Never']
    },
    dietary_preference: {
        type: String,
        enum: ['Vegetarian', 'Vegan', 'Pescatarian', 'Flexitarian', 'Omnivore', 'Other']
    },
    sleeping_habits: {
        type: String,
        enum: ['Early Bird', 'Night Owl', 'It varies']
    }
});

module.exports = mongoose.model('Lifestyle', lifestyleSchema);
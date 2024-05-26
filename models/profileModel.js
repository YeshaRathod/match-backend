// ProfileModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { calculateAge } = require('../utils/dateUtil')



// Import existing schemas
const User = require('./userModel');
const MoreAboutMe = require('./moreAboutMeModel');
const Lifestyle = require('./lifestyleModel');

const profileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // required: true
    },
    birthdate: {
        type: Date,
        // required: true,
    },
    gender: {
        type: String,
        // required: true,
        enum: ['male', 'female', 'other'],
    },
    preference_gender: {
        type: String,
        // required: true,
        enum: ['male', 'female', 'all'],
        default: 'all'
    },
    age: {
        type: Number
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    profile_picture: {
        type: [String],
        default: [],
    },
    moreAboutMe_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MoreAboutMe'
        //required: true
    },
    lifestyle_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lifestyle'
        //required: true
    }
});



//  Age calculation
profileSchema.pre('save', async function (next) {
    // Calculate age based on the birthdate
    this.age = await calculateAge(this.birthdate);
    //  console.log(this.age)
    next();
});

// Create Profile model
module.exports = mongoose.model('Profile', profileSchema);



const mongoose = require('mongoose');

const moreAboutMeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    zodiac: {
        type: String,
        enum: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    },
    education: {
        type: String,
        enum: ['High School', 'Bachelor Degree', 'Master Degree', 'At Uni', 'phD', 'Trade School']
    },
    family_plans: {
        type: String,
        enum: ['Want children', 'Do not want children', 'Not Sure Yet']
    },
    covid_vaccine: {
        type: String,
        enum: ['Fully vaccinated', 'Partially vaccinated', 'Not vaccinated', 'Prefer not say']
    },
    personality_type: {
        type: String,
        enum: ['Introvert', 'Extrovert', 'Ambivert']
    },
    communication_style: {
        type: String,
        enum: ['I stay on WhatsApp all day', 'Big Time Texter', 'Phone Caller', 'Video chatter', "I'm slow to answer on WhatsApp", "Bad Texter", "Better in Person"]
    },
    love_style: {
        type: String,
        enum: ['Thoughtful gestures', 'Presents', 'Touch', 'Compliments', 'Time Together']
    }
});
module.exports = mongoose.model('MoreAboutMe', moreAboutMeSchema);


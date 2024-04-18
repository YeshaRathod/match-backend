const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { calculateAge } = require('../utils/dateUtil')
const validator = require("validator");

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, "Name must be more than 2 characters"],
        maxlength: [20, "Name cannot not more than 20 characters"],
        validate: {
            validator: function (value) {
                return value.length >= 2 && value.length <= 20;
            },
            message: props => `${props.value} must be between 2 and 20 characters`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        },
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        match: [/^[0-9]{10}$/, "give valid mobile Number"],
    },
    password: {
        type: String,
        required: true,
        minlength: [5, "password length must be more than 4"],
        maxlength: [15, "password length cannot more then 15 "],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,

    },
},
    {
        timestamps: true,
    });


userSchema.pre("save", async function (next) {
    //  console.log(`the current password is ${this.password}`)
    this.password = await bcrypt.hash(this.password, 10)
    //   console.log(this.password)
    next();
})
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


module.exports = mongoose.model('User', userSchema);
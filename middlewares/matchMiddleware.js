const asyncHandler = require('express-async-handler')
const Profile = require('../models/ProfileModel')

const matchProfileMiddleware = asyncHandler(async (req, res, next) => {


})


module.exports = { matchProfileMiddleware }
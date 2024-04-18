const mongoose = require('mongoose')
const dbConnect = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("connection successfully")
    } catch (error) {
        console.log(error)
        console.log("failed")
    }
}


module.exports = dbConnect
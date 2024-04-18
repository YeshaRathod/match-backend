const mongoose = require('mongoose')
const validateMongodbId = ((id, res) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {

        return res.status(400).json("ID is not valid");
    }
})

module.exports = validateMongodbId
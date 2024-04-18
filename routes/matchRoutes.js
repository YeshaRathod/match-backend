const express = require("express")
const { matchProfiles, getFilteredData } = require("../controllers/matchCtrl")
const router = express.Router()


router.get('/filter', getFilteredData)
router.post('/match-profiles', matchProfiles);

// router.get('/matched', matchAlgorithm)



module.exports = router
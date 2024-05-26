const express = require("express")
const { createCard, getCards } = require("../controllers/cardCtrl")
const router = express.Router()

router.post('/cards', createCard)
router.get('/cards', getCards)

module.exports = router
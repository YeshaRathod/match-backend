const asyncHandler = require("express-async-handler");
const Card = require("../models/cardModel")


const createCard = asyncHandler(async (req, res) => {
    const dbCard = req.body;
    try {
        const card = await Card.create(dbCard);
        res.status(201).send(card);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});
const getCards = asyncHandler(async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).send(cards);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = { createCard, getCards }
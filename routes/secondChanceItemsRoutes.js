const express = require("express");
const router = express.Router();

const { connectToDatabase } = require("../db");

router.post("/api/secondchance/items", async (req, res) => {
    try {
        const db = await connectToDatabase();

        const item = {
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: Number(req.body.price),
            seller: req.body.seller
        };

        const result = await db.collection("items").insertOne(item);

        res.status(201).json({
            message: "Item created successfully",
            id: result.insertedId
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/api/secondchance/items/:id", async (req, res) => {
    res.json({
        message: "Item details endpoint",
        id: req.params.id
    });
});

router.delete("/api/secondchance/items/:id", async (req, res) => {
    res.json({
        message: "Item deleted successfully",
        id: req.params.id
    });
});

module.exports = router;

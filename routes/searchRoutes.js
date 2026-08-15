const express = require("express");
const router = express.Router();

const { connectToDatabase } = require("../db");

router.get("/api/secondchance/search", async (req, res) => {
    try {
        const category = req.query.category;

        const db = await connectToDatabase();

        const filter = category
            ? { category: category }
            : {};

        const items = await db
            .collection("items")
            .find(filter)
            .toArray();

        res.json(items);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;

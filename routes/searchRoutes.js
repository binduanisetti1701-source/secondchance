const express = require("express");
const { connectToDatabase } = require("../db");

const router = express.Router();

// Search items by category
router.get("/search", async (req, res) => {
    try {
        const db = await connectToDatabase();

        const category = req.query.category;

        if (!category) {
            return res.status(400).json({
                error: "Category is required"
            });
        }

        const items = await db.collection("items")
            .find({
                category: {
                    $regex: category,
                    $options: "i"
                }
            })
            .toArray();

        res.json(items);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to search items"
        });
    }
});

module.exports = router;

const express = require("express");
const multer = require("multer");
const { connectToDatabase } = require("../db");

const router = express.Router();

// Store uploaded files in memory
const upload = multer({
    storage: multer.memoryStorage()
});

// POST - Upload an item
router.post("/items", upload.single("file"), async (req, res) => {
    try {
        const db = await connectToDatabase();

        const item = {
            name: req.body.name || "Unnamed Item",
            description: req.body.description || "",
            category: req.body.category || "Other",
            price: req.body.price || 0,
            fileName: req.file ? req.file.originalname : null,
            fileType: req.file ? req.file.mimetype : null,
            createdAt: new Date()
        };

        const result = await db.collection("items").insertOne(item);

        res.status(201).json({
            message: "Item uploaded successfully",
            itemId: result.insertedId,
            item: item
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to upload item"
        });
    }
});

// GET - List all items
router.get("/items", async (req, res) => {
    try {
        const db = await connectToDatabase();

        const items = await db
            .collection("items")
            .find({})
            .toArray();

        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch items"
        });
    }
});

// GET - Get one item by ID
router.get("/items/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");
        const db = await connectToDatabase();

        const item = await db.collection("items").findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!item) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch item"
        });
    }
});

// DELETE - Remove an item
router.delete("/items/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");
        const db = await connectToDatabase();

        const result = await db.collection("items").deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.json({
            message: "Item deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete item"
        });
    }
});

module.exports = router;

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static("public"));

// Import routes
const secondChanceItemsRoutes = require("./routes/secondChanceItemsRoutes");
const searchRoutes = require("./routes/searchRoutes");
const authRoutes = require("./routes/authRoutes");

// API routes
app.use("/api/secondchance", secondChanceItemsRoutes);
app.use("/api/secondchance", searchRoutes);
app.use("/api/auth", authRoutes);

// Search endpoint required for Task 7
app.get("/api/secondchance/search", async (req, res) => {
    try {
        const { connectToDatabase } = require("./db");

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
            error: "Search failed"
        });
    }
});

// Home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(SecondChance server running on port ${PORT});
});

module.exports = app;

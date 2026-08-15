const express = require("express");
const cors = require("cors");

const secondChanceItemsRoutes =
    require("./routes/secondChanceItemsRoutes");

const searchRoutes =
    require("./routes/searchRoutes");

const authRoutes =
    require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static("public"));

// API routes
app.use(secondChanceItemsRoutes);
app.use(searchRoutes);
app.use(authRoutes);

// Landing page
app.get("/", (req, res) => {
    res.sendFile("index.html", {
        root: "public"
    });
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "success",
        message: "SecondChance application is running"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Internal server error",
        error: err.message
    });
});

module.exports = app;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

app.get("/health", (req, res) => {
    res.json({
        status: "success",
        message: "SecondChance application is running"
    });
});

module.exports = app;

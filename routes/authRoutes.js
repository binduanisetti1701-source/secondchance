const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const users = [];

router.post("/api/auth/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const existingUser = users.find(
            user => user.username === username
        );

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: users.length + 1,
            username,
            email: email || "",
            password: hashedPassword
        };

        users.push(user);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        item => item.username === username
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

router.put("/api/auth/users/:id", (req, res) => {
    const userId = Number(req.params.id);

    const user = users.find(
        item => item.id === userId
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (req.body.email) {
        user.email = req.body.email;
    }

    res.json({
        message: "User information updated successfully",
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

module.exports = router;

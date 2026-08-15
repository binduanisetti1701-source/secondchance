const express = require("express");
const bcrypt = require("bcryptjs");
const { connectToDatabase } = require("../db");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const db = await connectToDatabase();

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required"
            });
        }

        const existingUser = await db.collection("users").findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                error: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.collection("users").insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: result.insertedId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Registration failed"
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const db = await connectToDatabase();

        const { email, password } = req.body;

        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Login failed"
        });
    }
});

// UPDATE USER INFORMATION
router.put("/update/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");
        const db = await connectToDatabase();

        const { name, email } = req.body;

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    ...(name && { name }),
                    ...(email && { email }),
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json({
            message: "User information updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Update failed"
        });
    }
});

module.exports = router;

const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");

const User = require("../models/User");

const { signToken, authMiddleware } = require("../utils/auth");


// REGISTER
router.post("/register", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        // check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// LOGIN
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // create JWT
        const token = signToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.user._id)
            .select("-password");

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });
    }
});

// github login route
router.get(
    "/auth/github",

    passport.authenticate("github", {
        scope: ["user:email"]
    })
);

// github Callback route
router.get(
    "/auth/github/callback",

    passport.authenticate("github", {
        session: false,
        failureRedirect: "/login"
    }),

    async (req, res) => {

        try {

            // create JWT
            const token = signToken(req.user);

            // send token back
            res.json({
                message: "GitHub login successful",
                token,
                user: {
                    _id: req.user._id,
                    username: req.user.username,
                    email: req.user.email
                }
            });

        } catch (error) {

            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

module.exports = router;
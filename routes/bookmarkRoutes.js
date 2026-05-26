const express = require("express");

const router = express.Router();

const Bookmark = require("../models/Bookmark");

const { authMiddleware } = require("../utils/auth");


// CREATE BOOKMARK
router.post("/", authMiddleware, async (req, res) => {

    try {

        const bookmark = await Bookmark.create({

            title: req.body.title,

            url: req.body.url,

            user: req.user._id
        });

        res.status(201).json(bookmark);

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// GET ALL BOOKMARKS (ONLY LOGGED-IN USER)
router.get("/", authMiddleware, async (req, res) => {

    try {

        const bookmarks = await Bookmark.find({
            user: req.user._id
        });

        res.json(bookmarks);

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// GET SINGLE BOOKMARK
router.get("/:id", authMiddleware, async (req, res) => {

    try {

        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {

            return res.status(404).json({
                message: "Bookmark not found"
            });
        }

        // ownership check
        if (bookmark.user.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                message: "Not authorized"
            });
        }

        res.json(bookmark);

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// UPDATE BOOKMARK
router.put("/:id", authMiddleware, async (req, res) => {

    try {

        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {

            return res.status(404).json({
                message: "Bookmark not found"
            });
        }

        // ownership check
        if (bookmark.user.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const updatedBookmark = await Bookmark.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }
        );

        res.json(updatedBookmark);

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// DELETE BOOKMARK
router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {

            return res.status(404).json({
                message: "Bookmark not found"
            });
        }

        // ownership check
        if (bookmark.user.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await Bookmark.findByIdAndDelete(req.params.id);

        res.json({
            message: "Bookmark deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });
    }
});

module.exports = router;
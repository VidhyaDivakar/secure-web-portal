const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookmarkSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
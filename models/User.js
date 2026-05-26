

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Must match an email address!"],
    },
    password: {
        type: String,
        required: function () { return !this.githubId; },
        minlength: 8, // required only for local users
    },
    githubId: {
        type: String,
        // optional for local users
    }
});


// //hashing password
// // use a pre('save') hook, which tells Mongoose to run our function before any User document is saved.
// userSchema.pre("save", async function (next) {
//     if (this.isNew || this.isModified("password")) {
//         const bcrypt = require("bcrypt");
//         const saltRounds = 10;
//         this.password = await bcrypt.hash(this.password, saltRounds);
//     }

// });

module.exports = mongoose.model("User", userSchema);


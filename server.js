const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");

console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID?.trim());
console.log("GitHub Callback URL:", process.env.GITHUB_CALLBACK_URL?.trim());

const app = express();


// middleware
app.use(express.json());

app.use(passport.initialize());


// database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error));


// routes
app.use("/api", authRoutes);

app.use("/api/bookmarks", bookmarkRoutes);

// global debug
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

// port
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
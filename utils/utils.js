const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const expiration = "2h";

const signToken = (user) => {

    const payload = {
        _id: user._id,
        email: user.email,
        username: user.username
    };

    return jwt.sign(payload, secret, {
        expiresIn: expiration
    });
};

const authMiddleware = (req, res, next) => {

    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Authentication token missing"
        });
    }

    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    try {

        const decoded = jwt.verify(token, secret);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = {
    signToken,
    authMiddleware
};
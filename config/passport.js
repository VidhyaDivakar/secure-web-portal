const passport = require("passport");

const GitHubStrategy = require("passport-github2").Strategy;

const User = require("../models/User");

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID?.trim(),
            clientSecret: process.env.GITHUB_CLIENT_SECRET?.trim(),
            callbackURL: process.env.GITHUB_CALLBACK_URL?.trim()
        },

        async (accessToken, refreshToken, profile, done) => {

            try {

                // GitHub email (safe): some GitHub profiles don't expose emails
                const email = (profile.emails && profile.emails.length && profile.emails[0].value)
                    || (profile._json && profile._json.email)
                    || `${profile.username}@users.noreply.github.com`;

                // Check if user already exists
                let user = await User.findOne({ email });

                // If no user, create one
                if (!user) {

                    user = await User.create({
                        username: profile.username,
                        email: email,
                        githubId: profile.id
                    });
                }

                // If user exists but no githubId
                if (!user.githubId) {

                    user.githubId = profile.id;

                    await user.save();
                }

                return done(null, user);

            } catch (error) {

                return done(error, null);
            }
        }
    )
);

module.exports = passport;
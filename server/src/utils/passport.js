import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/userModel.js';
import dotenv from 'dotenv'
dotenv.config()
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        // console.log(profile?.photos)
        // Check if a user exists with this email
        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            // Link Google account to existing email-based user
            user.googleId = profile.id;
            user.profile =  user.profile || profile.photos[0]?.value ;
            await user.save();
          }
        } else {
          // Create a new user if no existing email is found
          user = await User.create({
            googleId: profile.id,
            email,
            name: profile.displayName,
            profile: profile.photos[0]?.value || '',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);


export default passport;

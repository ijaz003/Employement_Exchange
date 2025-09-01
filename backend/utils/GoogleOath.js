import pkg from 'passport-google-oauth20';
const { Strategy: GoogleStrategy } = pkg;
import passport from 'passport';
import { User } from '../models/userSchema.js';
import jwt from 'jsonwebtoken';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    passReqToCallback: true
  },
  async function(req, accessToken, refreshToken, profile, done) {
    // Fix: Safely extract role from session or query, fallback to default
    let role = "Job Seeker";
    if (req.session && req.session.role) {
      role = req.session.role;
    } else if (req.query && req.query.role) {
      role = req.query.role;
    }
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avator: profile.photos[0].value,
        role: role
      }); 
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "2d" });
    done(null, {user,token});
  }
));

passport.serializeUser((userObj, done) => done(null, userObj));
passport.deserializeUser((userObj, done) => done(null, userObj));
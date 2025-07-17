// import pkg from 'passport-google-oauth20';
// const { Strategy: GoogleStrategy } = pkg;
// import passport from 'passport';
// import { User } from '../models/userSchema.js';

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `${process.env.BACKEND_URL}/api/v1/user/google/callback`
//   },
//   async function(req,accessToken, refreshToken, profile, cb) {
//     const role=req.query.role;
//     console.log("Role:", role);
//     const user = await User.findOne({ googleId: profile.id });
//     if(!user){
//         const user=await User.create({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             avator: profile.photos[0].value
//         });
//         cb(null, user);
//     }
//     else{
//         cb(null, user);
//     }
//   }
// ));



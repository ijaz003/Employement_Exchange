import express from "express";
import getUser from "../controllers/Auth/GetUser.js";
import login from "../controllers/Auth/Login.js";
import register from "../controllers/Auth/Register.js";
import logout from "../controllers/Auth/Logout.js";
import { isAuthenticated } from "../middlewares/auth.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { updateUserProfile } from "../controllers/Auth/UpdateUserProfile.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.patch("/update", isAuthenticated, updateUserProfile);


// Google OAuth routes
router.get('/google', (req, res, next) => {
  // Save role in session if sent from frontend
  if (req.query.role) {
    req.session = req.session || {};
    req.session.role = req.query.role;
  }
  passport.authenticate('google', { scope: ['profile','email'] })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // req.user: { user, token } from GoogleOath.js
    const user = req.user.user;
    const token = req.user.token;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Send user info to frontend via query string
    const userQuery = encodeURIComponent(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      avator: user.avator,
      role: user.role,
      session_id: user.session_id
    }));
    res.redirect(`${process.env.FRONTEND_URL}/?googleUser=${userQuery}`);
  }
);

export default router;

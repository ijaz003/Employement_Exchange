import express from "express";
import getUser from "../controllers/Auth/GetUser.js";
import login from "../controllers/Auth/Login.js";
import register from "../controllers/Auth/Register.js";
import logout from "../controllers/Auth/Logout.js";
import { isAuthenticated } from "../middlewares/auth.js";
import passport from "passport";
import jwt from "jsonwebtoken";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/auth/google/callback',
   passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log(req.user,"bhai ye user")
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

export default router;

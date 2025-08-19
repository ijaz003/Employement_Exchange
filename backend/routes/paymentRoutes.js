import express from "express";
import CheckoutSession from "../controllers/Payment/CheckoutSession.js";
import VerifyPayment from "../controllers/Payment/VerifyPayment.js";
import { isAuthenticated } from "../middlewares/auth.js";



const router=express.Router();

router.post("/create-checkout-session",isAuthenticated, CheckoutSession);
router.get("/verify-payment/:session_id", isAuthenticated, VerifyPayment);

export default router;
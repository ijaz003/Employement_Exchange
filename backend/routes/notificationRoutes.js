import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import GetNotifications from "../controllers/Notification/GetNotifications.js";
import UnreadNotifications from "../controllers/Notification/UnreadNotifications.js";


const router = express.Router();

router.get("/", isAuthenticated, GetNotifications );
router.patch("/unread/:notificationId", isAuthenticated, UnreadNotifications);

export default router;

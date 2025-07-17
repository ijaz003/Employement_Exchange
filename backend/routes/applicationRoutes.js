import express from "express";
import employerGetAllApplications from "../controllers/Application/GetAllApplication.js";
import postApplication from "../controllers/Application/PostApplication.js";
import jobseekerGetAllApplications from "../controllers/Application/GetAppliedApplication.js";
import jobseekerDeleteApplication from "../controllers/Application/DeleteAppliedAppliedApplication.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postApplication);
router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);

export default router;

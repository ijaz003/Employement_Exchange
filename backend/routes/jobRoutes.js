import express from "express";
import getAllJobs from "../controllers/Job/GetAllJobs.js";
import { GetLatestJobs } from "../controllers/Job/GetLatestJobs.js";
import getMyJobs from "../controllers/Job/GetEmployeesJobs.js";
import postJob from "../controllers/Job/PostJob.js";
import updateJob from "../controllers/Job/UpdatePostedJob.js";
import deleteJob from "../controllers/Job/DeletePostedJob.js";
import getSingleJob from "../controllers/Job/GetSingleJob.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall",isAuthenticated, getAllJobs);
router.get("/latest", GetLatestJobs);
router.post("/postjob", isAuthenticated, postJob);
router.get("/getmyjobs", isAuthenticated, getMyJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);
router.get("/:id", isAuthenticated, getSingleJob);

export default router;

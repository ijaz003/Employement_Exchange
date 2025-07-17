import { Job } from "../../models/jobSchema.js";

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default getAllJobs;
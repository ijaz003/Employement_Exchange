import { Job } from "../../models/jobSchema.js";

const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const totalJobs = await Job.countDocuments({ expired: false });
    const jobs = await Job.find({ expired: false })
      .sort({ jobPostedOn: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      jobs,
      totalJobs,
      page,
      totalPages: Math.ceil(totalJobs / limit),
      limit
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
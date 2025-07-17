import { Job } from "../../models/jobSchema.js";

const deleteJob = async (req, res) => {
  try{
    const { role } = req.user;
  const { id } = req.params;

  if (role === "Job Seeker") {
    return res.status(403).json({
      success: false,
      message: "Job Seekers cannot delete jobs.",
    });
  }

  const job = await Job.findById(id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted successfully.",
  });
  }
  catch(error){
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default deleteJob;
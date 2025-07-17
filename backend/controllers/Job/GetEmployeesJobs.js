import { Job } from "../../models/jobSchema.js";

 const getMyJobs = async (req, res) => {
  try{
    const { role, _id } = req.user;

  if (role === "Job Seeker") {
    return res.status(403).json({
      message: "Job Seekers cannot access this resource.",
    });
  }

  const myJobs = await Job.find({ postedBy: _id });

  res.status(200).json({
    success: true,
    myJobs,
  });
  }
  catch(error){
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default getMyJobs;
import { Job } from "../../models/jobSchema.js";

const updateJob = async (req, res) => {
  const { role } = req.user;
  const { id } = req.params;

  try{
    if (role === "Job Seeker") {
      return res.status(403).json({
        success: false,
        message: "Job Seekers cannot update jobs.",
      });
    }
  
    let job = await Job.findById(id);
  
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }
  
    job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job,
    });
  }
  catch(error){
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default updateJob;
import { Application } from "../../models/applicationSchema.js";
import { Job } from "../../models/jobSchema.js";
// import cloudinary from "cloudinary";
import cloudinary from "../../utils/cloudinary.js";

const postApplication = async (req, res) => {

  try{
    const { role, _id: userId } = req.user;

    if(!userId || !role) {
      return res.status(400).json({
        message: "User ID and role are required.",
      });
    }

  if (role === "Employer") {
    return res.status(403).json({
      message: "Employers are not allowed to apply for jobs.",
    });
  }

  if (!req.files?.resume) {
    return res.status(400).json({
      success: false,
      message: "Resume file is required.",
    });
  }

  const resume = req.files.resume;
  const { name, email, coverLetter, phone, address, jobId } = req.body;

  if (!name || !email || !coverLetter || !phone || !address || !jobId) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields.",
    });
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }

  const uploadResult = await cloudinary.uploader.upload(resume.tempFilePath);
  if (!uploadResult?.secure_url) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload resume.",
    });
  }

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID: {
      user: userId,
      role: "Job Seeker",
    },
    employerID: {
      user: job.postedBy,
      role: "Employer",
    },
    resume: {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully.",
    application,
  });
  }
  catch (error) {
    console.error("Error in postApplication:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export default postApplication;
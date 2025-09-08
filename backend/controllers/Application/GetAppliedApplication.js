import { Application } from "../../models/applicationSchema.js";

const jobseekerGetAllApplications = async (req, res) => {
  try {
    const { role, _id } = req.user;

    if (role === "Employer") {
      return res.status(403).json({
        message: "Employers are not allowed to access this resource.",
      });
    }

  const applications = await Application.find({ "applicantID.user": _id }).sort({ createdAt: 1 });

    res.status(200).json({
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default jobseekerGetAllApplications;
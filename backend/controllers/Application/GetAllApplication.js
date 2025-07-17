import { Application } from "../../models/applicationSchema.js";



 const employerGetAllApplications = async (req, res) => {
  const { role, _id } = req.user;

  if (role === "Job Seeker") {
    return res.status(403).json({
      message: "Job Seekers are not allowed to access this resource.",
    });
  }

  const applications = await Application.find({ "employerID.user": _id });

  res.status(200).json({
    applications,
  });
};

export default employerGetAllApplications;
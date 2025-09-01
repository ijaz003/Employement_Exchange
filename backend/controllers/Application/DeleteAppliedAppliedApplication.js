import { Application } from "../../models/applicationSchema.js";

const jobseekerDeleteApplication = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.params;

    if (role === "Employer") {
      return res.status(403).json({
        message: "Employers are not allowed to perform this action.",
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    await Application.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default jobseekerDeleteApplication;
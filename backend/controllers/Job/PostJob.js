import { Job } from "../../models/jobSchema.js";
import { io } from "../../app.js";
import { Notification } from "../../models/notificationSchema.js";

const postJob = async (req, res) => {
  try {
    const { role, _id: postedBy } = req.user;

    if (role === "Job Seeker") {
      return res.status(403).json({
        success: false,
        message: "Job Seekers are not allowed to post jobs.",
      });
    }

    const {
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
    } = req.body;

    const missingFields = [];
    if (!title) missingFields.push("Title");
    if (!description) missingFields.push("Description");
    if (!category) missingFields.push("Category");
    if (!country) missingFields.push("Country");
    if (!city) missingFields.push("City");
    if (!location) missingFields.push("Location");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following fields are required: ${missingFields.join(", ")}`,
      });
    }

    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
      return res.status(400).json({
        success: false,
        message: "Please provide either fixed salary or ranged salary.",
      });
    }

    if (salaryFrom && salaryTo && fixedSalary) {
      return res.status(400).json({
        success: false,
        message: "Cannot provide both fixed and ranged salary.",
      });
    }

    const job = await Job.create({
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      postedBy,
    });

    io.emit("newJobPosted", job);
    const notification = await Notification.create({
          sender: postedBy,
          receiver: null,
          type: "post",
          content: `A new post has been created: ${job.title}`,
        });
        io.emit("notification", notification);
        console.log(notification, "Notification data");
    res.status(201).json({
      success: true,
      message: "Job posted successfully!",
      job,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default postJob;
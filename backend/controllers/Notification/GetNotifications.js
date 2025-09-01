
import {Notification}  from "../../models/notificationSchema.js";

const GetNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { receiver: req.user._id },
        { receiver: null }
      ]
  }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export default GetNotifications
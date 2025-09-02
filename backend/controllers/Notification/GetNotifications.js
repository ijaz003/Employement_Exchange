
import {Notification}  from "../../models/notificationSchema.js";

const GetNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { receiver: req.user._id },
        { receiver: null }
      ]
  }).sort({ createdAt: -1 });

  // Count unread notifications for this user
  const userId = req.user._id.toString();
  const unreadCount = notifications.filter(notification => {
    // Personal notification
    if (notification.receiver) {
      return !notification.isRead;
    } else {
      // Global notification
      return !(notification.readBy || []).map(String).includes(userId);
    }
  }).length;

    res.status(200).json({
      success: true,
      unreadCount,
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
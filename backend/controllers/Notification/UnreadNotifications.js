import {Notification}  from "../../models/notificationSchema.js";


const UnreadNotifications = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    if (notification.receiver) {
      // User-specific notification
      if (!notification.isRead) {
        notification.isRead = true;
        await notification.save();
      }
    } else {
      // Global notification
      if (!notification.readBy) notification.readBy = [];
      if (!notification.readBy.includes(userId)) {
        notification.readBy.push(userId);
        await notification.save();
      }
    }
    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export default UnreadNotifications;

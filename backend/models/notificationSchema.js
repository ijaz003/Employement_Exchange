// models/notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
    type: {
      type: String,
      enum: [ "follow", "apply", "post"],
      required: true,
    },
    content: { type: String }, // optional, like "UserX liked your post"
  isRead: { type: Boolean, default: false },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);

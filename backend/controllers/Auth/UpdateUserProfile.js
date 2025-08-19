import { User } from "../../models/userSchema.js";

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateFields = req.body;
    // console.log("Update Fields:", updateFields,"userId",userId);
    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    console.log("Updated User:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error." });
  }
};
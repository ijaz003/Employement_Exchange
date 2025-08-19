import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  phone: {
    type: Number,
    // required: function () {
    //   return !this.googleId;
    // },
    default:+920000000000,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    
  },
  role: {
    type: String,
    required: true,
    default: "Job Seeker",
    enum: ["Job Seeker", "Employer"],
  },
  avator:{
    type:String,
    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQADjfoADAlJPrsl_hiiOMeE-FBor-i6hEAVg&s",
  },
  // plan: {
  //   type: String,
  //   enum: ["free", "monthly", "yearly"],
  //   default: "free"
  // },
  // planExpiry: {
  //   type: Date,
  //   default: null
  // },
  // isPremium: {
  //   type: Boolean,
  //   default: false
  // },
  session_id: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);

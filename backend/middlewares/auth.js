import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Token Not Found", });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "User Not Authorized" });
    }
    const FindUser = await User.findById(decoded.id);
    if (!FindUser) {
      return res.status(401).json({ message: "User Not Found" });
    }
    req.user = FindUser;
    next();
  } 
  catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

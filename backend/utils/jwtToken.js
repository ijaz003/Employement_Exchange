import jwt from "jsonwebtoken";
export const sendToken = (user, res, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  
  
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // 
  };

  return res.status(201).cookie("token", token, options).json({
    user,
    message
  });
};

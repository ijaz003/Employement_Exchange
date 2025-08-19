import { User } from "../../models/userSchema.js";
import { sendToken } from "../../utils/jwtToken.js";
import bcrypt from "bcrypt";


 const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(req.body,"data by signin")

    const missingFields = [];
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");
    if (!role) missingFields.push("Role");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({
          message: `The following fields are required: ${missingFields.join(
            ", "
          )}`,
        });
    }


    const user = await User.findOne({ email }).select("+password");
    console.log("user", user);
    if (!user) {
      return res.status(401).json({message: "User not found!"});
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({message: "Invalid password!"});
    }
    

    if (user.role !== role) {
      return res.status(404).json({message: `User with provided email and role '${role}' not found!`});
    }

    sendToken(user, res, "User logged in successfully!");
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default login;
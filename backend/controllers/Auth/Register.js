import { User } from "../../models/userSchema.js";
import { sendToken } from "../../utils/jwtToken.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        const missingFields = [];
        if (!name) missingFields.push("Name");
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

        const isEmail = await User.findOne({ email });
        if (isEmail) {
            return res.status(400).json({
                message: "Email already registered!",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashPassword,
            role,
        });

        sendToken(user, res, "User registered successfully!");
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default register;

import Stripe from "stripe";
import { User } from "../../models/userSchema.js";

const stripe = new Stripe(process.env.Secret_Key);

const VerifyPayment = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        let sessionId;

        if (req.params.session_id) {
            // Update user with session_id if provided
            await User.updateOne({ _id: userId }, { session_id: req.query.session_id });
            sessionId = req.params.session_id;
        } else {
            const user = await User.findById(userId);
            if (!user || !user.session_id) {
                return res.status(404).json({ error: "Session ID not found for user." });
            }
            sessionId = user.session_id;
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
            return res.json({ paid: true });
        } else {
            return res.json({ paid: false });
        }
    } catch (error) {
        console.error("VerifyPayment error:", error);
        return res.status(500).json({ error: error.message });
    }
};

export default VerifyPayment;
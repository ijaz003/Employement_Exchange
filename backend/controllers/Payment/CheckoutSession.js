import Stripe from "stripe";
const stripe = new Stripe(process.env.Secret_Key);


const CheckoutSession = async (req,res) => {

    const { role, _id } = req.user;
    try {
        const { priceId } = req.body;
        if (!priceId) {
            return res.status(400).json({ message: "must provide the priceId" });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                }
            ],
            success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/cancel",
            metadata: { userId: _id }
        });

        // Save session.id to user in DB
        try {
            const { User } = await import("../../models/userSchema.js");
            await User.updateOne({ _id }, { session_id: session.id });
        } catch (dbError) {
            console.error("Error saving session_id to user:", dbError);
        }


        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ error: error.message });
    }
}


export default CheckoutSession;
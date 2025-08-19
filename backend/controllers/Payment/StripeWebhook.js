// import Stripe from "stripe";
// import { User } from "../../models/userSchema.js";

// const stripe = new Stripe(process.env.Secret_Key);

// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// const StripeWebhook = async (req, res) => {
// 	const sig = req.headers['stripe-signature'];
// 	let event;
// 	try {
// 		event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
// 	} catch (err) {
// 		console.error("Webhook signature verification failed.", err.message);
// 		return res.status(400).send(`Webhook Error: ${err.message}`);
// 	}

// 	if (event.type === 'checkout.session.completed') {
// 		const session = event.data.object;
// 		const userId = session.metadata.userId;
// 		let plan = "free";
// 		let planExpiry = null;
// 		let isPremium = false;
// 		// Determine plan type from priceId
// 		const priceId = session.line_items?.[0]?.price || session.metadata.priceId;
// 		if (priceId === "price_1RxNBILPbohNYBTRw11asdyE") {
// 			plan = "monthly";
// 			planExpiry = new Date();
// 			planExpiry.setMonth(planExpiry.getMonth() + 1);
// 			isPremium = true;
// 		} else if (priceId === "price_1RxOWfLPbohNYBTR7efF8ARL") {
// 			plan = "yearly";
// 			planExpiry = new Date();
// 			planExpiry.setFullYear(planExpiry.getFullYear() + 1);
// 			isPremium = true;
// 		}
// 		try {
// 			await User.findByIdAndUpdate(userId, {
// 				plan,
// 				planExpiry,
// 				isPremium
// 			});
// 		} catch (err) {
// 			console.error("Error updating user after payment:", err);
// 		}
// 	}
// 	res.status(200).json({ received: true });
// };

// export default StripeWebhook;

import Subscriber from "../models/Subscriber.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

// @desc    Subscribe to the newsletter
// @route   POST /api/subscribe
export const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === "subscribed") {
        return res.status(200).json({ success: true, message: "Already subscribed!" });
      } else {
        subscriber.status = "subscribed";
        await subscriber.save();
        return res.status(200).json({ success: true, message: "Resubscribed successfully!" });
      }
    }

    // New subscriber
    subscriber = new Subscriber({ email, status: "subscribed" });
    await subscriber.save();

    // Send welcome email asynchronously
    sendWelcomeEmail(email).catch(console.error);

    res.status(201).json({ success: true, message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Subscription Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    Unsubscribe from the newsletter
// @route   GET /api/subscribe/unsubscribe/:email
export const unsubscribe = async (req, res) => {
  const { email } = req.params;

  try {
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).send("Subscriber not found.");
    }

    if (subscriber.status === "unsubscribed") {
      return res.status(200).send("You are already unsubscribed.");
    }

    subscriber.status = "unsubscribed";
    await subscriber.save();

    res.status(200).send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h2>Unsubscribed Successfully</h2>
        <p>You have been removed from our mailing list and will no longer receive notifications.</p>
      </div>
    `);
  } catch (error) {
    console.error("Unsubscribe Error:", error);
    res.status(500).send("Internal server error. Please try again later.");
  }
};

// @desc    Get subscription status
// @route   GET /api/subscribe/status/:email
export const getStatus = async (req, res) => {
  const { email } = req.params;

  try {
    const subscriber = await Subscriber.findOne({ email });
    if (subscriber && subscriber.status === "subscribed") {
      return res.status(200).json({ success: true, isSubscribed: true });
    }
    return res.status(200).json({ success: true, isSubscribed: false });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    Toggle subscription (Used in UI)
// @route   POST /api/subscribe/toggle
export const toggleSubscription = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === "subscribed") {
        subscriber.status = "unsubscribed";
        await subscriber.save();
        return res.status(200).json({ success: true, message: "Unsubscribed successfully!", isSubscribed: false });
      } else {
        subscriber.status = "subscribed";
        await subscriber.save();
        return res.status(200).json({ success: true, message: "Subscribed successfully!", isSubscribed: true });
      }
    }

    // New subscriber
    subscriber = new Subscriber({ email, status: "subscribed" });
    await subscriber.save();

    // Send welcome email asynchronously
    sendWelcomeEmail(email).catch(console.error);

    return res.status(201).json({ success: true, message: "Subscribed successfully!", isSubscribed: true });
  } catch (error) {
    console.error("Toggle Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

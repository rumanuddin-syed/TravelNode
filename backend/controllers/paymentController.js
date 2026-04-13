import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

// Submit payment proof
const submitPayment = async (req, res) => {
  try {
    const { bookingId, userId, amount, transactionId } = req.body;
    const paymentProof = req.file ? `/public/uploads/payments/${req.file.filename}` : null;

    if (!paymentProof) {
      return res.status(400).json({ success: false, message: "Payment proof image is required" });
    }

    // Check if a payment for this booking already exists and is pending
    let payment = await Payment.findOne({ bookingId });

    if (payment) {
      // Update existing payment if it was rejected or pending
      payment.paymentProof = paymentProof;
      payment.transactionId = transactionId;
      payment.status = "pending_verification";
      await payment.save();
    } else {
      // Create new payment
      payment = new Payment({
        bookingId,
        userId,
        amount,
        paymentProof,
        transactionId,
        status: "pending_verification",
      });
      await payment.save();
    }

    // Update booking status to pending and paymentStatus to pending_verification
    await Booking.findByIdAndUpdate(bookingId, { 
      status: "pending",
      paymentStatus: "pending_verification"
    });

    res.status(201).json({
      success: true,
      message: "Payment proof submitted successfully. Waiting for admin verification.",
      data: payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Admin verify payment
const verifyPayment = async (req, res) => {
  try {
    const { paymentId, status } = req.body; // status: "paid" or "failed"
    console.log("-> Processing Verification Request:", { paymentId, status });

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      console.warn("!! Verification Failed: Payment not found", paymentId);
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    console.log("✓ Payment located, current status:", payment.status);
    payment.status = status;
    await payment.save();
    console.log("✓ Payment record saved with new status:", status);

    // Ensure we have the correct ID whether populated or not
    const bookingId = payment.bookingId._id ? payment.bookingId._id.toString() : payment.bookingId.toString();
    console.log("-> Updating Booking record:", bookingId);

    if (status === "paid") {
      await Booking.findByIdAndUpdate(bookingId, { 
        status: "confirmed",
        paymentStatus: "paid"
      });
      console.log("✓ Booking status updated to 'confirmed'");
    } else if (status === "failed") {
      await Booking.findByIdAndUpdate(bookingId, { 
        paymentStatus: "failed"
      });
      console.log("✓ Booking status updated to 'failed'");
    }

    res.status(200).json({
      success: true,
      message: `Payment successfully updated to ${status}.`,
      data: payment,
    });
  } catch (error) {
    console.error("!! FATAL: verifyPayment Internal Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error during verification" });
  }
};

// Get all payments for admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "username email")
      .populate("bookingId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get payment by booking ID
const getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const payment = await Payment.findOne({ bookingId });
    
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { submitPayment, verifyPayment, getAllPayments, getPaymentByBooking };

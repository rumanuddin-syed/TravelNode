import express from "express";
import {
  submitPayment,
  verifyPayment,
  getAllPayments,
  getPaymentByBooking,
} from "../controllers/paymentController.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// User routes
router.post("/submit", verifyToken, upload.single("paymentProof"), submitPayment);
router.get("/booking/:bookingId", verifyToken, getPaymentByBooking);

// Admin routes
router.get("/all", verifyToken, verifyAdmin, getAllPayments);
router.post("/verify", verifyToken, verifyAdmin, verifyPayment);

export default router;
